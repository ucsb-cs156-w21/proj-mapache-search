package edu.ucsb.mapache.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.validation.Valid;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.mapache.advice.AuthControllerAdvice;
import edu.ucsb.mapache.documents.SlackUser;
import edu.ucsb.mapache.entities.Admin;
import edu.ucsb.mapache.entities.AppUser;
import edu.ucsb.mapache.models.SlackUserWithStats;
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

@RestController
@RequestMapping("/api")
public class SlackUserController {
    private final Logger logger = LoggerFactory.getLogger(RoleController.class);

    @Autowired
    SlackUserRepository slackUserRepository;

    @Autowired
    private AuthControllerAdvice authControllerAdvice;

    private ObjectMapper mapper = new ObjectMapper();

    private ResponseEntity<String> getUnauthorizedResponse(String roleRequired) throws JsonProcessingException {
        Map<String, String> response = new HashMap<String, String>();
        response.put("error", String.format("Unauthorized; only %s may access this resource.", roleRequired));
        String body = mapper.writeValueAsString(response);
        return new ResponseEntity<String>(body, HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/slackUsers")
    public ResponseEntity<String> users(@RequestHeader("Authorization") String authorization)
            throws JsonProcessingException {
        if (!authControllerAdvice.getIsAdmin(authorization))
            return getUnauthorizedResponse("admin");
        Iterable<SlackUser> slackUsers = slackUserRepository.findAll();
        String body = mapper.writeValueAsString(slackUsers);
        return ResponseEntity.ok().body(body);
    }

    @GetMapping("/slackUsersWithMessageCounts")
    public ResponseEntity<String> usersWithMsgCounts(@RequestHeader("Authorization") String authorization)
            throws JsonProcessingException {
        if (!authControllerAdvice.getIsAdmin(authorization))
            return getUnauthorizedResponse("admin");
        Iterable<SlackUser> slackUsers = slackUserRepository.findAll();

        // add some logic here that creates a new type of object
        // that has the message count along with the SlackUser.

        List<SlackUserWithStats> usersWithStats = new ArrayList<SlackUserWithStats>();

        for (SlackUser su: slackUsers) {
            SlackUserWithStats userWithStats = new SlackUserWithStats();
            userWithStats.setSlackUser(su);

            // figure out how many messages there are in the 
            // message repository with this user and set the
            // variable messageCount = to that;

            int messageCount = 0;

            userWithStats.setMessageCount(messageCount);
        }

        String body = mapper.writeValueAsString(usersWithStats);
        
        return ResponseEntity.ok().body(body);
    }
}
