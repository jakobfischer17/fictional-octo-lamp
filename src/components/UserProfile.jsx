import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, graphConfig } from '../authConfig';
import './UserProfile.css';

function UserProfile() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      fetchUserProfile();
    }
  }, [accounts]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get access token
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      });

      // Call Microsoft Graph API
      const graphResponse = await fetch(graphConfig.graphMeEndpoint, {
        headers: {
          Authorization: `Bearer ${response.accessToken}`
        }
      });

      if (!graphResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await graphResponse.json();
      setGraphData(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-profile loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile error">
        <p>⚠️ Could not load profile data</p>
      </div>
    );
  }

  if (!graphData) {
    return null;
  }

  return (
    <div className="user-profile">
      <h3>Your Profile</h3>
      <div className="profile-grid">
        <div className="profile-item">
          <span className="profile-label">Name:</span>
          <span className="profile-value">{graphData.displayName || 'N/A'}</span>
        </div>
        
        {graphData.mail && (
          <div className="profile-item">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{graphData.mail}</span>
          </div>
        )}
        
        {graphData.userPrincipalName && !graphData.mail && (
          <div className="profile-item">
            <span className="profile-label">User Principal:</span>
            <span className="profile-value">{graphData.userPrincipalName}</span>
          </div>
        )}
        
        {graphData.jobTitle && (
          <div className="profile-item">
            <span className="profile-label">Job Title:</span>
            <span className="profile-value">{graphData.jobTitle}</span>
          </div>
        )}
        
        {graphData.officeLocation && (
          <div className="profile-item">
            <span className="profile-label">Office:</span>
            <span className="profile-value">{graphData.officeLocation}</span>
          </div>
        )}
        
        {graphData.mobilePhone && (
          <div className="profile-item">
            <span className="profile-label">Mobile:</span>
            <span className="profile-value">{graphData.mobilePhone}</span>
          </div>
        )}
        
        {graphData.businessPhones && graphData.businessPhones.length > 0 && (
          <div className="profile-item">
            <span className="profile-label">Business Phone:</span>
            <span className="profile-value">{graphData.businessPhones[0]}</span>
          </div>
        )}
        
        <div className="profile-item">
          <span className="profile-label">Account ID:</span>
          <span className="profile-value account-id">{graphData.id?.substring(0, 16)}...</span>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
