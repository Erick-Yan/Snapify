import axios from 'axios';
import { useMutation } from 'react-query';

async function saveProfileData(data) {
  try {
    const response = await axios.post('/user/save_profile', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to save profile data');
  }
}

export function useSaveProfile() {
    return useMutation(saveProfileData, {
        mutationKey: 'saveProfile',
    });
  }