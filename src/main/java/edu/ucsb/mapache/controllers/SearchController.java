package edu.ucsb.mapache.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.mapache.advice.AuthControllerAdvice;
import edu.ucsb.mapache.documents.SlackUser;
import edu.ucsb.mapache.entities.Admin;
import edu.ucsb.mapache.entities.AppUser;
import edu.ucsb.mapache.repositories.AdminRepository;
import edu.ucsb.mapache.repositories.AppUserRepository;
import edu.ucsb.mapache.repositories.SlackUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import edu.ucsb.mapache.models.SearchParameters;
import org.springframework.beans.factory.annotation.Value;
import edu.ucsb.mapache.services.GoogleSearchService;

@RestController
@RequestMapping("/api/member/search")
public class SearchController {
    private final Logger logger = LoggerFactory.getLogger(SearchController.class);

    @Autowired
    private AppUserRepository appUserRepository;

    @Value("${app.namespace}")
    private String namespace;

    @Value("${app.google.search.apiToken}")
    private String apiToken;

    @Autowired
    private AuthControllerAdvice authControllerAdvice;

    @Autowired
    private GoogleSearchService googleSearchService;

    private ObjectMapper mapper = new ObjectMapper();


    public DecodedJWT getJWT(String authorization) {
        return JWT.decode(authorization.substring(7));
    }

    private AppUser getCurrentUser(String authorization){
        DecodedJWT jwt = getJWT(authorization);
        Map<String, Object> customClaims = jwt.getClaim(namespace).asMap();
        String email = (String) customClaims.get("email");
        logger.info("email={}", email);
        List<AppUser> users = appUserRepository.findByEmail(email);// obtain email of current user
        logger.info("user={}", users);
        AppUser you =null;
        if(users.isEmpty()){
            you = new AppUser();
            you.setEmail(email);
            String firstName = (String) customClaims.get("given_name");
            String lastName = (String) customClaims.get("family_name");
            you.setFirstName(firstName);
            you.setLastName(lastName);
            appUserRepository.save(you);
        }else{
            you=users.get(0);
        }
        return you;
    }
    
    public static bool shouldReset(long lastUpdate, long currentTime){
        long lastUpdateDate= (lastUpdate-8*60*60*1000)/(24*60*60*1000);
        long currentDate= (currentTime-8*60*60*1000)/(24*60*60*1000);
        return currentDate>lastUpdateDate;
    }
    private ResponseEntity<String> getUnauthorizedResponse(String roleRequired) throws JsonProcessingException {
        Map<String, String> response = new HashMap<String, String>();
        response.put("error", String.format("Unauthorized; only %s may access this resource.", roleRequired));
        String body = mapper.writeValueAsString(response);
        return new ResponseEntity<String>(body, HttpStatus.UNAUTHORIZED);
    }
    private ResponseEntity<String> searchQuotaExceeded() throws JsonProcessingException {
        Map<String, String> response = new HashMap<String, String>();
        response.put("error", "Your Search Quota is now 0");
        String body = mapper.writeValueAsString(response);
        return new ResponseEntity<String>(body, HttpStatus.FORBIDDEN);
    }

    @GetMapping("/basic")
    public ResponseEntity<String> basicSearch(@RequestHeader("Authorization") String authorization, 
        @RequestParam String searchQuery)
        throws JsonProcessingException {
        if (!authControllerAdvice.getIsMember(authorization))
            return getUnauthorizedResponse("member");

        AppUser you =getCurrentUser(authorization);

        long lastUpdate=you.getTime();
        long currentTime=(long) (new Date().getTime());
        if(shouldReset(lastUpdate,currentTime)){
            you.setSearchRemain(100);
        }
       
        if(you.getSearchRemain()<=0){
            return searchQuotaExceeded();
        }
        you.setTime(currentTime);
        you.decrSearchRemain();
        appUserRepository.save(you);

        SearchParameters sp = new SearchParameters();
        sp.setQuery(searchQuery);
        sp.setPage(1);
        logger.info("sp={} apiToken={}", sp, apiToken);
        String body = googleSearchService.getJSON(sp,apiToken);
        logger.info("body={}", body);

        //the body that's passed into line 58 should be the JSON for the search results
        return ResponseEntity.ok().body(body);
    }

    @GetMapping("/quota")
    public ResponseEntity<String> basicSearch(@RequestHeader("Authorization") String authorization)
        throws JsonProcessingException {
        if (!authControllerAdvice.getIsMember(authorization))
            return getUnauthorizedResponse("member");

        AppUser you =getCurrentUser(authorization);
        int searchRemain = you.getSearchRemain();

        Map<String, Object> response = new HashMap<String, Object>();
        response.put("quota",new Integer(searchRemain));
        String body = mapper.writeValueAsString(response);

        //the body that's passed into line 58 should be the JSON for the search results
        return ResponseEntity.ok().body(body);
    }
}