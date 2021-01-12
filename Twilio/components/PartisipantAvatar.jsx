import React, { memo } from 'react';
import Avatar from '@material-ui/core/Avatar';

const PartisipantAvatar = ({user}) => 
  <Avatar
    alt={user?.full_name || "Unknown partisipant"}
    src={user?.image ? user?.image.thumbnail.url : ''}
    className="partisipantAvatar"
  /> 

export default memo(PartisipantAvatar);
