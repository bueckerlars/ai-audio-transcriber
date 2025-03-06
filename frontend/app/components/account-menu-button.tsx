import React from 'react';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { ChevronDown, MoreHorizontal } from 'lucide-react';

const AccountMenuButton = (props: {profileImageUrl: string}) => {

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={props.profileImageUrl}/>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const handleProfileClicked = () => {
    // TODO implement
}

export default AccountMenuButton;