import "../stylesheets/stylesheet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ChatContainer from "./chatContainer";
import { Row, Col } from "react-bootstrap";
import LoadingSpinner from "./loading";

function Contact(props) {
  const id = props;
  const [profile, setProfile] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState("");
  const [recentProfiles, setRecentProfile] = useState([]);
  const [recentProfilesSave, setRecentProfileSave] = useState();
  const [recentProfilesId, setRecentProfileId] = useState();
  const [recentUserIds, setRecentUserIds] = useState();
  const [search, setSearch] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [filteredRecentProfiles, setFilteredRecentProfiles] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getAllProfiles?q=${search}`)
      .then((profile) => {
        setProfile(profile.data);
      })
      .catch((error) => console.error(error));
  }, [search]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/get/chat/msg/${userInfo?._id}`)
      .then((recentProfilesId) => {
        setRecentProfileId(recentProfilesId.data);
      })
      .catch((error) => console.error(error));
  }, [userInfo]);

  useEffect(() => {
    if (recentProfilesId) {
      const recentChats = recentProfilesId.map((recentProfilesId) => {
        return recentProfilesId.Chatusers.find((id) => id !== userInfo._id);
      });
      setRecentUserIds([...new Set(recentChats)]);
    }
    console.log("Recent UserIds " + recentUserIds); //shows as undefined
  }, [recentProfilesId]);

  //Filtering the all profiles by the ids above to return the recent profiles

  useEffect(() => {
    if (recentUserIds) {
      const filteredUsers = recentUserIds.map((ids) => {
        return profile.filter((profile) => profile._id === ids);
      });
      setRecentProfile(filteredUsers);
      setRecentProfileSave(filteredUsers);
    }
    console.log(recentProfiles); //shows undefined
  }, [recentUserIds]);
  // useEffect(() => {
  //     if (recentUserIds) {
  //         const fetchUsers = async () => {
  //             const filteredUsers = await Promise.all(
  //                 recentUserIds.map(async (ids) => {
  //                     const response = await axios.get(`http://localhost:3001/getAllProfile/${ids}`);
  //                     return response.data;
  //                 })
  //             );
  //             setRecentProfile(filteredUsers);
  //             setRecentProfileSave(filteredUsers);
  //         };

  //         fetchUsers();
  //     }
  // }, [recentUserIds]);

  // useEffect(() => {
  //     if(recentProfiles && search){
  //         const flattenedProfiles = recentProfiles.flat(); // flattening the profiles allows me to use profile rather than profile[0]
  //         setRecentProfile(flattenedProfiles.filter(profile => {
  //                 const name = `${profile?.fName} ${profile?.lName}`;
  //                 return name.toLowerCase().includes(search.toLowerCase());
  //               }));

  //             //   setRecentProfile(filtered);
  //               console.log(recentProfiles);
  //     }

  //     if(!search){

  //         setRecentProfile(recentProfilesSave);
  //     }
  // }, [search]);
//   const contactListRef = useRef(recentProfiles);
//   useEffect(() => {
//     contactListRef.current = [...recentProfiles].reverse(); 
//   }, [recentProfiles])

const reversed = recentProfiles.reverse(); // reversing the profiles so it will list in order or recently started a conversation

  useEffect(() => {
    if (recentProfiles && search) {
        
      const flattenedProfiles = reversed.flat();
      const filteredProfiles = flattenedProfiles.filter((profile) => {
        const name = `${profile?.fName} ${profile?.lName}`;
        return name.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredRecentProfiles(filteredProfiles);
    } else {
      // If there's no search or recentProfilesSave is not available, use the original recentProfiles
      setFilteredRecentProfiles(recentProfilesSave);
    }
  }, [search, recentProfilesSave]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/profileDetails/${id.id}`)
      .then((chatUser) => setCurrentChatUser(chatUser.data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleUser = (e) => {
    setCurrentChatUser(e);
  };

  useEffect(() => {
    if (!recentProfiles) {
      setProfilesLoading(true);
    } else if (recentProfiles) {
      setTimeout(async () => {
        setProfilesLoading(false);
        console.log(recentProfiles[0]);
      }, 1000);
    }
  }, [recentProfiles]);


  return (
    <Row>
      <Col sm={4}>
        <div className="mainContactContainer">
          {userInfo?.type == "admin" ? (
            <div style={{ width: "20px", padding: "10px" }}>
              <input
                type="search"
                placeholder="Search Messages"
                className="searchMessagesBar"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
           ) : (
            "" 
          )} ;

          <div className="userDetailsContainer">
            {userInfo?.type == "admin" ? (
              <>
                {profile?.map((user) => (
                  <div>
                    {user?._id !== userInfo?._id ? (
                      <div
                        key={user?.id}
                        className="userContainer"
                        onClick={(e) => handleUser(user)}
                      >
                        <img
                          src={user?.pic}
                          alt="userImage"
                          className="chatUserImage"
                        />
                        <div style={{ marginLeft: "10px" }}>
                          <p
                            style={{
                              textAlign: "start",
                              marginTop: "5px",
                              fontSize: "15px",
                            }}
                          >
                            {user.fName + " " + user.lName}{" "}
                          </p>
                          <p
                            style={{
                              textAlign: "start",
                              marginTop: "-13px",
                              fontSize: "14px",
                            }}
                          >
                            Message User
                          </p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {profilesLoading === true ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {filteredRecentProfiles &&
                      filteredRecentProfiles?.reverse().map((user) => ( //reversing the order so who the user has started a converation with more recently is shown at the top
                        <div key={user[0]?.id}>
                          {/* {user[0] && ( */}
                            <div
                              className="userContainer"
                              onClick={(e) => handleUser(user[0])}
                            >
                              <img
                                src={user[0]?.pic}
                                alt="userImage"
                                className="chatUserImage"
                              />
                              <div style={{ marginLeft: "10px" }}>
                                <p
                                  style={{
                                    textAlign: "start",
                                    marginTop: "5px",
                                    fontSize: "15px",
                                  }}
                                >
                                  {user[0]?.fName + " " + user[0]?.lName}{" "}
                                </p>
                                <p
                                  style={{
                                    textAlign: "start",
                                    marginTop: "-13px",
                                    fontSize: "14px",
                                  }}
                                >
                                  Open Message
                                </p>
                              </div>
                            </div>
                        {/* //   )} */}
                        </div>
                      ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Col>
      <Col sm={8}>
        {currentChatUser.fName !== undefined ? (
          <ChatContainer currentChatUser={currentChatUser} />
        ) : (
          <div className="chatLanding">
            <p className="chatLandingText">Open a recent message</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default Contact;
