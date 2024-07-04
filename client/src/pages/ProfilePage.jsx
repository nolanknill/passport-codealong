import { useEffect, useState } from 'react';
import axios from 'axios';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

const ProfilePage = () => {
  // Keep track of three things in state:
  // - authentication process state (default: in process of authenticating)
  // - whether user is logged (default: not logged in)
  // - profile data for logged in user (default: profile data is null)
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Send a GET request for profile information
    // If user is currently logged in, we will get profile data, if they are not logged in, we will get 401 (Unauthorized) that we can handle in `.catch`
    // Note that we need to use `withCredentials` in order to pass the cookie to a server
    axios
      .get(`${SERVER_URL}/auth/profile`, { withCredentials: true })
      .then((res) => {
        // Update the state: done authenticating, user is logged in, set the profile data
        setIsAuthenticating(false);
        setIsLoggedIn(true);
        setProfileData(res.data);
      })
      .catch((err) => {
        // If we are getting back 401 (Unauthorized) back from the server, means we need to log in
        if (err.response.status === 401) {
          // Update the state: done authenticating, user is not logged in
          setIsAuthenticating(false);
          setIsLoggedIn(false);
        } else {
          console.log('Error authenticating', err);
        }
      });
  }, []);

  const formatDate = (date) => {
    // Return date formatted as 'month/day/year'
    return new Date(date).toLocaleDateString('en-US');
  };

  // While the component is authenticating, do not render anything (alternatively, this can be a preloader)
  if (isAuthenticating) return null;

  return (
    <section className="profile-page">
      <h1>Profile Page</h1>
      {/* If user is logged in, render their profile information */}
      {isLoggedIn ? (
        profileData && (
          <>
            <h2>Hello, {profileData.username}</h2>
            <h3>Registered since: {formatDate(profileData.updated_at)}</h3>
            <img
              className="profile-page__avatar"
              src={profileData.avatar_url}
              alt={`${profileData.username} avatar`}
            />
            <div className="profile-page__logout-wrapper">
              {/* Render a logout button */}
              <LogoutButton />
            </div>
          </>
        )
      ) : (
        // If user is not logged in, render a login button
        <>
          <p>
            <strong>This page requires authentication.</strong>
          </p>
          <LoginButton />
        </>
      )}
    </section>
  );
};

export default ProfilePage;