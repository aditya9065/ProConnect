import { BASE_URL } from '@/config/redux';
import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';

export default function MyConnectionPage
() {

  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth);
  const router = useRouter();

  useEffect(()=>{
    dispatch(getMyConnectionRequests({token: localStorage.getItem('token')}));
  },[]);

  useEffect(()=>{

    if(authState.connectionRequest.length != 0){
    }
  },[])

  return (
    <div>
        <UserLayout>
            <DashboardLayout>
              <div >
              <h2>Connection Requests</h2>
                {authState.connectionRequest.length != 0  && authState.connectionRequest.connections.filter((user)=>user.status===null).map((user) => {
                  return(
                    <div
                     onClick={(()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                     })}
                     key={user._id} className={styles.userCard}>
                      <div style={{display: 'flex', alignItems: 'center', gap:"1rem"}}>
                        <div className={styles.profilePicture}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                        <button onClick={(e)=>{e.stopPropagation(); dispatch(AcceptConnection({connectionId: user._id, token: localStorage.getItem('token'), action: "accept"}));}} className={styles.connectedButton}>Accept</button>
                      </div>
                    </div>
                    
                  )
                })}
                <h2>My Connections</h2>
                {authState.connectionRequest.length != 0  && authState.connectionRequest.connections.filter((user)=>user.status!==null).map((user)=>{
                  return(
                    <div
                     onClick={(()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                     })}
                     key={user._id} className={styles.userCard}>
                      <div style={{display: 'flex', alignItems: 'center', gap:"1rem"}}>
                        <div className={styles.profilePicture}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                        <div style={{cursor:"auto"}} className={styles.connectedButton}>Connected</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </DashboardLayout>
        </UserLayout>
    </div>
  )
}
