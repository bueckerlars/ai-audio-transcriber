import { useNavigate } from 'react-router-dom';
import { logout } from '~/api';

export function useAccountMenu() {
  const navigate = useNavigate();

  const handleProfileMenuItemClick = () => {
    navigate('/u/username');
  };

  const handleSettingsMenuItemClick = () => {
    navigate('/settings');
  };

  const handleLogoutMenuItemClick = () => {
    // Perform logout logic here
    navigate('/login');
    logout();
  };

  return {
    handleProfileMenuItemClick,
    handleSettingsMenuItemClick,
    handleLogoutMenuItemClick,
  };
}