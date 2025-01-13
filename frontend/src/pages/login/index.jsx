import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/Dashboard");

    }
  },[authState.loggedIn]);

  useEffect(()=>{
    dispatch(emptyMessage());
  }, [userLoginMethod])

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/Dashboard")

    }
  },[])

  const handleRegister = () => {
    dispatch(registerUser({username, password, email, name}))
  };

  const handleLogin = () =>{
    dispatch(loginUser({ email, password}))
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            <p style={{color: authState.isError ? "red" : "green"}}>{authState.message.message}</p>

            <div className={styles.inputContainers}>
              {userLoginMethod ? <></> :
              <div className={styles.inputRow}>
                <input
                  type="text"
                  onChange={(e)=>{
                    setUsername(e.target.value)
                  }}
                  className={styles.inputField}
                  placeholder="Username"
                />
                <input
                  type="text"
                  onChange={(e)=>{
                    setName(e.target.value)
                  }}
                  className={styles.inputField}
                  placeholder="Name"
                />
              </div>}

              <input
                type="text"
                onChange={(e)=>{
                  setEmailAddress(e.target.value)
                }}
                className={styles.inputField}
                placeholder="Email"
              />
              <input
                type="text"
                onChange={(e)=>{
                  setPassword(e.target.value)
                }}
                className={styles.inputField}
                placeholder="Password"
              />

              <div className={styles.buttonWithOutline}>
                <p
                  className={styles}
                  onClick={() => {
                    if (userLoginMethod) {
                      handleLogin();
                    } else {
                      handleRegister();
                    }
                  }}
                >
                  {userLoginMethod ? "Sign In" : "Sign Up"}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer__right}>
            <div>
            <p>{!userLoginMethod ? "Already Have an Account?":"Want to Register?"}</p>
            <div style={{color: "black", textAlign:'center'}} className={styles.buttonWithOutline}>
                <p
                  className={styles}
                  onClick={() => {
                    setUserLoginMethod(!userLoginMethod)
                  }}
                >
                  {userLoginMethod ? "Sign Up" : "Sign In"}

                </p>
              </div>
              </div>

          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
