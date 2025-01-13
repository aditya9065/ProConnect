import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import { BASE_URL } from '@/config/redux'
import { useRouter } from 'next/router'

export default function Discovepage() {
    const authState = useSelector((state)=>state.auth)
    const dispatch = useDispatch();

    const router = useRouter();

    useEffect(()=>{
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers())
            console.log("3")
        }
    },[])
  return (


    <UserLayout>
        <DashboardLayout>
            <div>
              <h1>Discover</h1>
              <div className={styles.allUserProfile}>
                {
                  // console.log(authState.all_users)
                  authState.all_profiles_fetched && authState.all_users.map((user)=>{
                    return(
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }} key={user._id} className={styles.userCard}>
                      <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profilePic"  className={styles.userCard__image}/>
                      <div style={{display:'flex', flexDirection:"column", gap:"0.3rem"}}>
                      <p style={{fontWeight:"bold", fontSize:"2.2rem"}}>{user.userId.name}</p>
                      <p>@{user.userId.username}</p>
                      </div>
                    </div>
                    )
                  })
                }
              </div>
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}
