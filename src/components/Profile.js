import React, {useState, useEffect } from 'react';

const Profile = props => {

    const [userProfile, setUserProfile] = useState({
        profile: '',
        error: ''
    });

    useEffect(() => loadUserProfile(),[]);

    // function to get user profile
    const loadUserProfile = () => {
        props.auth.getUserProfile((profile, error) => setUserProfile({
            ...userProfile,
            profile,
            error
        }));
    }

    const {profile, error} = userProfile;
 
    return (
        <div>
            <h1>Profile Page</h1>
    <p>{profile.nickname}</p>
    <img style={{ maxWidth: 50, maxHeight: 50 }} src={profile.picture} alt={profile.pic} />
    <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
    );
};

export default Profile;