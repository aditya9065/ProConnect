import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config/redux";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function ProfilePage() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);

  const [userProfile, setUserProfile] = useState({});
  const [userPost, setUserPost] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdModalOpen, setIsEdModalOpen] = useState(false);

  const [workData, setWorkData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const [edData, setEdData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setWorkData({ ...workData, [name]: value });
  };

  const handleEdInputChange = (e) => {
    const { name, value } = e.target;
    setEdData({ ...edData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);

      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPost(post);
    }
  }, [authState.user, postReducer.posts]);

  useEffect(() => {}, [postReducer.post]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
      username: userProfile.userId.usernmae,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      education: userProfile.education,
      pastWork: userProfile.pastWork,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backDrop__overlay}
              >
                <p>Edit</p>
              </label>
              <input
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
                type="file"
                name=""
                id="profilePictureUpload"
                hidden
              />
              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt="hwa"
                className={styles.backdrop}
              />
            </div>

            <div className={styles.profileContainer__details}>
              <div className={styles.in__profileContainer__details} style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      width: "fit-content",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      name=""
                      id=""
                      className={styles.nameEdit}
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div>
                    <p style={{ color: "grey" }}>
                      @
                      <input
                        style={{
                          color: "grey",
                          fontWeight: "normal",
                          fontSize: "0.9rem",
                        }}
                        type="text"
                        name=""
                        id=""
                        className={styles.nameEdit}
                        value={userProfile.userId.username}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            userId: {
                              ...userProfile.userId,
                              username: e.target.value,
                            },
                          });
                        }}
                      />
                    </p>
                  </div>
                  <div>
                    <p>
                      <textarea
                        style={{
                          color: "",
                          fontWeight: "normal",
                          fontSize: "1.2rem",
                          width: "100%",
                        }}
                        type="text"
                        name=""
                        id=""
                        className={styles.nameEdit}
                        value={userProfile.bio}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            bio: e.target.value,
                          });
                        }}
                      ></textarea>
                    </p>
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
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
                {userProfile.pastWork.length > 0 ? (
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
                ) : (
                  <p>Nothing yet</p>
                )}
              </div>

              <button
                className={styles.addWorkButton}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Add Work
              </button>
            </div>

            <div className={styles.workHistory}>
              <h4>Education History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.education.length > 0 ? (
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
                ) : (
                  <p>Nothing yet</p>
                )}
              </div>
              <button
                className={styles.addWorkButton}
                onClick={() => {
                  setIsEdModalOpen(true);
                }}
              >
                Add Education
              </button>
            </div>
            {userProfile != authState.user && (
          <div className={styles.updateProfileBtn} onClick={updateProfileData}>
            {" "}
            Update Profile
          </div>
        )}
          </div>
        )}

        {isModalOpen && (
          <div
            className={styles.box}
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.workBox}
            >
              <input
                type="text"
                name="company"
                id=""
                placeholder="Enter Company Name"
                onChange={handleWorkInputChange}
              />
              <input
                type="text"
                name="position"
                id=""
                placeholder="Enter Position"
                onChange={handleWorkInputChange}
              />
              <input
                type="text"
                name="years"
                id=""
                placeholder="Enter Work Duration"
                onChange={handleWorkInputChange}
              />
              <div
                className={styles.updateProfileBtn}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, workData],
                  });
                  setIsModalOpen(false);
                }}
              >
                
                Add Work
              </div>
            </div>
          </div>
        )}

{isEdModalOpen && (
          <div
            className={styles.box}
            onClick={(e) => {
              e.stopPropagation();
              setIsEdModalOpen(false);
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.workBox}
            >
              <input
                type="text"
                name="school"
                id=""
                placeholder="Enter Institute Name"
                onChange={handleEdInputChange}
              />
              <input
                type="text"
                name="degree"
                id=""
                placeholder="Enter Degree"
                onChange={handleEdInputChange}
              />
              <input
                type="text"
                name="fieldOfStudy"
                id=""
                placeholder="Enter Field"
                onChange={handleEdInputChange}
              />
              <div
                className={styles.updateProfileBtn}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    education: [...userProfile.education, edData],
                  });
                  setIsEdModalOpen(false);
                }}
              >
                
                Add Education
              </div>
            </div>
          </div>
        )}
        
      </DashboardLayout>
    </UserLayout>
  );
}
