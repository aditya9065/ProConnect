import { BASE_URL, clientServer } from "@/config/redux";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnetionRequests,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

function ViewProfilePage({ userProfile }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParam = useSearchParams();
  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userPost, setUserPost] = useState([]);
  const [isConnectionNull, setIsConnectionNull] = useState(true);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const getUserPost = async (params) => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnetionRequests({ token: localStorage.getItem("token") })
    );
    await dispatch(getMyConnectionRequests({token: localStorage.getItem('token')}))
  };

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });

    setUserPost(post);
  }, [postReducer.posts]);

  useEffect(() => {
    if (
      authState.connections.some((user) => {
        return user.connectionId === userProfile.userId._id;
      })
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId === userProfile.userId._id
        ).status === true
      ) {
        setIsConnectionNull(false);
      }
    }
    if(authState.connectionRequest.connections)
    {
      console.log(authState.connectionRequest.connections)
      if (
      authState.connectionRequest.connections.some((user) => {
        return user.userId._id === userProfile.userId._id;
      })
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connectionRequest.connections.find(
          (user) => user.userId._id === userProfile.userId._id
        ).status === true
      ) {
        setIsConnectionNull(false);
      }
    }}
  }, [authState.connections, authState.connectionRequest.connections]);

  useEffect(() => {
    getUserPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="hwa"
              className={styles.backdrop}
            />
          </div>

          <div className={styles.profileContainer__details}>
            <div className={styles.profileContainer__flex}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    width: "fit-content",
                    alignItems: "center",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems:'center', gap:"1.2rem"}}>
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            user_id: userProfile.userId._id,
                          })
                        );
                      }}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}
                  <div onClick={async ()=>{
                    const response = await clientServer.get(`/user/download_resume?user_id=${userProfile._id}`)
                    window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                  }}>
                    <svg
                      style={{width:"1.2em", cursor:'pointer'}}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>
              <div style={{ flex: "0.2"}} className={styles.recentActivity}>
                <h3>Recent Activity</h3>
                {userPost.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card__profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`} />
                          ) : (
                            <div></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {
              userProfile.pastWork.length > 0 ?
              userProfile.pastWork.map((work) => {
                return (
                  <div key={work._id} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })
              : <p>Nothing yet</p>
            }
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Education History</h4>
            <div className={styles.workHistoryContainer}>
              {
              userProfile.education.length > 0 ?
              userProfile.education.map((course) => {
                return (
                  <div key={course._id} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {course.degree} - {course.fieldOfStudy}
                    </p>
                    <p>{course.school}</p>
                  </div>
                );
              })
            : <p>Nothing yet</p>
            }
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default ViewProfilePage;

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    }
  );

  const response = await request.data;

  return { props: { userProfile: response.profile } };
}
