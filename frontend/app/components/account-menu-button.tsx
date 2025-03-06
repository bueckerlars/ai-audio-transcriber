import { 
    Avatar, 
    AvatarImage 
} from '~/components/ui/avatar';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger 
} from "./ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';
import { logout } from '~/api';

const AccountMenuButton = (props: {profileImageUrl: string}) => {
    const navigate = useNavigate();

    const handleProfileMenuItemClick = () => {
        navigate('/u/username');
    }

    const handleSettingsMenuItemClick = () => {
        navigate('/settings');
    }

    const handleLogoutMenuItemClick = () => {
        // Perform logout logic here
        navigate('/login');
        logout();
    }

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={props.profileImageUrl}/>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleProfileMenuItemClick}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsMenuItemClick}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogoutMenuItemClick}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default AccountMenuButton;