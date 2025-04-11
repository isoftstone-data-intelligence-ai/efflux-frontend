// components/Avatar.js
import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

// 生成颜色
const getColorFromInitial = (initial) => {
  const colors = [
    "#E5484A",
    "#6950FF",
    "#FF9420",
    "#FF9420",
    "#FFC600",
    "#0082D7",
    "#B6A474",
    "#4C6DBD",
    "#34C2B9",
    "#407EFE",
    "#9A4FFF",
    "#FF3BD0",
    "#79869F",
    "#BA7252",
    "#047825",
    "#9E91FF",
    "#965858",
    "#C6CCDF",
    "#06B96F",
    "#00CFFF",
    "#FF8686",
    "#C7E333",
    "#2352EE",
    "#FF3279",
    "#477B65",
    "#99692C"
  ];
  // 使用首字母的 Unicode 码来确定颜色
  const index = initial.charCodeAt(0) % colors.length;
  return colors[index];
};

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.map(n => n.charAt(0).toUpperCase()).join('');
};

const AvatarComponent = ({ name }) => {
  const initials = getInitials(name);
  const color = getColorFromInitial(initials.charAt(0));

  return (
    <Avatar.Root>
      {/* <Avatar.Image
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`}
        alt={name}
        style={{ borderRadius: '50%', width: '50px', height: '50px' }}
      /> */}
      <Avatar.Fallback
        style={{
          width: '45px',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
          color: '#fff',
          borderRadius: '50%',
          fontWeight: 'bold',
          fontSize:'18px'
        }}
      >
        {initials || ''}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};

export default AvatarComponent;