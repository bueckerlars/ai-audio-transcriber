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
} from "./ui/dropdown-menu";
import { useAccountMenu } from '~/hooks/useAccountMenu';

const AccountMenuButton = (props: {profileImageUrl: string}) => {
    const {
        handleProfileMenuItemClick,
        handleSettingsMenuItemClick,
        handleLogoutMenuItemClick,
    } = useAccountMenu();

    return (
        <DropdownMenu>
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