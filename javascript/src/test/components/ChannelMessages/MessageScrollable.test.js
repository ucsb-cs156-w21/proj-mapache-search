import React from "react";
import { render } from "@testing-library/react";
import MessageScrollableView from "main/components/ChannelMessages/MessageScrollableView";
import useSWR from "swr";
jest.mock("swr");
jest.mock("react-router-dom", () => {
    return {
        'useParams': jest.fn(),
    };
});
describe("MessageScrollableView tests", () => {
    test("renders without crashing", () => {
        useSWR.mockReturnValue({
            data: []
        });
        render(<MessageScrollableView messages={[]} channel={""} />);
    });

    test("Default message display", () => {
        useSWR.mockReturnValue({
            data: [{
                id: "U017218J9B3",
                real_name: "Test Person"
            }]
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "Someone said U017218J9B3",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const nameElement = getByText(/Someone said U017218J9B3/);
        expect(nameElement).toBeInTheDocument();
    });


    test("Displays username in message", () => {
        useSWR.mockReturnValue({
            data: [{
                id: "U017218J9B3",
                real_name: "Test Person"
            }]
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "<@U017218J9B3> has joined the channel",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        setTimeout(function (){
            const nameElement = getByText(/Test Person has joined the channel/);
            expect(nameElement).toBeInTheDocument();
        }, 500)

    });

    test("Displays username", () => {
        useSWR.mockReturnValue({
            data: [{
                id: "U017218J9B3",
                real_name: "Test Person"
            }]
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "<@U017218J9B3> has joined the channel",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getAllByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const nameElement = getAllByText(/Test Person/);
        expect(nameElement).toHaveLength(2);

    });

    test("Username not found", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "<@U017218J9B3> has joined the channel",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        setTimeout(function (){
            const nameElement = getByText(/@U017218J9B3/);
            expect(nameElement).toBeInTheDocument();
        }, 500)
    });

    test("Unembedded https links are clickable", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "Office hours at <https://youtu.be/dQw4w9WgXcQ>",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const linkElement = getByText(/https:\/\/youtu.be\/dQw4w9WgXcQ/);
        expect(linkElement.href).toEqual("https://youtu.be/dQw4w9WgXcQ");
        
    });

    test("Unembedded email links are clickable", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "Email me at <mailto:test@ucsb.edu>",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const linkElement = getByText(/mailto:test@ucsb.edu/);
        expect(linkElement.href).toEqual("mailto:test@ucsb.edu");
        
    });

    test("Unembedded phone links are clickable", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "Call me at <tel:+01234567890>",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const linkElement = getByText("tel:+01234567890");
        expect(linkElement.href).toEqual("tel:+01234567890");
        
    });

    test("Embedded https links are clickable", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "Office hours at <https://youtu.be/dQw4w9WgXcQ>",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const linkElement = getByText(/youtu/);
        expect(linkElement.href).toEqual("https://youtu.be/dQw4w9WgXcQ");
        
    });

    test("Embedded email links are clickable", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "Email me at <mailto:test@ucsb.edu|this email>",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const linkElement = getByText(/this email/);
        expect(linkElement.href).toEqual("mailto:test@ucsb.edu");
        
    });

    test("Embedded phone links are clickable", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "Call me at <tel:+01234567890|+0 123 456 7890>",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const linkElement = getByText("+0 123 456 7890");
        expect(linkElement.href).toEqual("tel:+01234567890");
        
    });

    test("Channel links are clickable", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "Please post in <#C01K1CR63MX|help-jpa02>",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const linkElement = getByText(/#help-jpa02/);
        expect(linkElement.href).toEqual("http://localhost/member/channels/help-jpa02");
        
    });    

    test("Brackets removed from Channel IDs and they are not links", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "<!channel> This is an announcement",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {queryByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        var bracketElement = queryByText(/<@channel>/);
        expect(bracketElement).toEqual(null);
        bracketElement = queryByText(/@channel/);
        expect(bracketElement).toBeInTheDocument();
        
    });

    test("Bracketed text that is not an http or mailto link is not clickable", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "<!channel> This is an announcement",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const bracketElement = getByText(/@channel/);
        expect(bracketElement.getAttribute("href")).toEqual(null);
        
    });

    test("Date and time render correctly", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1610833617.007900",
            "user": "U017218J9B3",
            "text": "<!channel> This is an announcement",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        // the timestamps in this test are in UTC because Jest tests
        // and Github tests use UTC time zone
        const date = getByText("2021-01-16 21:46:57");
        expect(date).toBeInTheDocument();
        
    });

    test("Channel tags begin with @ and are bolded", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "<!channel> This is an announcement",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {getByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        const bracketElement = getByText(/@channel/);
        expect(bracketElement).toHaveStyle("font-weight: bold");
        
    });

    test("Brackets removed from elements that are not links", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = {
            "type": "message",
            "subtype": "channel_join",
            "ts": "1594143066.000200",
            "user": "U017218J9B3",
            "text": "<!channel> This is an announcement <testing>",
            "channel": "section-6pm",
            "user_profile": {
                "real_name": "Test Person"
            }
        }
        const {queryByText} = render(<MessageScrollableView messages={[exampleMessage]}/>);
        var bracketElement = queryByText(/<testing>/);
        expect(bracketElement).toEqual(null);
        bracketElement = queryByText(/testing/);
        expect(bracketElement).toBeInTheDocument();
        
    });

    test("Messages sorted in chronological order", () => {
        useSWR.mockReturnValue({
            data: []
        });
        const exampleMessage = [
            {
                "type": "message3",
                "subtype": "channel_join",
                "ts": "1611257072.000900", //Jan 21, 2021, 11:24:32 (Pacific Time)
                "user": "U017218J9B3",
                "text": "<!channel> This is an announcement",
                "channel": "section-6pm",
                "user_profile": {
                    "real_name": "Test Person"
                }
            },
            {     
                "type": "message1",
                "subtype": "channel_join",
                "ts": "1611875002.014300", //Jan 28 2021, 15:03:22 (Pacific Time)
                "user": "U017218J9B3",
                "text": "<!channel> This is an announcement",
                "channel": "section-6pm",
                "user_profile": {
                    "real_name": "Test Person"
                }
            },
            {
                "type": "message2",
                "subtype": "channel_join",
                "ts": "1611867078.013800", //Jan 28, 2021, 12:51:18 (Pacific Time)
                "user": "U017218J9B3",
                "text": "<!channel> This is an announcement",
                "channel": "section-6pm",
                "user_profile": {
                    "real_name": "Test Person"
                }
            }
        ]
        const {getAllByText} = render(<MessageScrollableView messages={exampleMessage}/>);
            //The timestamps in this test are in UTC because Jest tests and the Github tests use UTC timezone
            const dates = getAllByText(/2021.{15}/);
            const expectedDate1 = "2021-01-28 23:03:22"; 
            const expectedDate2 = "2021-01-28 20:51:18";
            const expectedDate3 = "2021-01-21 19:24:32";
            expect(dates[0]).toHaveTextContent(expectedDate1);
            expect(dates[1]).toHaveTextContent(expectedDate2);
            expect(dates[2]).toHaveTextContent(expectedDate3);
    });

});
