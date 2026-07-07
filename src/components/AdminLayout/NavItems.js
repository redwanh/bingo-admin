import Icons from './icons';

export const navItems = [
  { icon: Icons.Dashboard, label: 'Dashboard', path: '/dashboard',
    description: 'Overview',
    roles: ['superadmin', 'admin', 'finance', 'moderator', 'support', 'viewer']
  },
  { 
    icon: Icons.Users, 
    label: 'Users', 
    path: '/users',
    description: 'Manage users',
    roles: ['superadmin', 'admin', 'moderator', 'support', 'viewer']
  },
  { 
    icon: Icons.Transactions, 
    label: 'Transactions', 
    path: '/transactions',
    description: 'Financial history',
    roles: ['superadmin', 'admin', 'finance', 'viewer']
  },
{ 
  icon: Icons.Deposits, 
  label: 'Accounts', 
  path: '/account-management',           
  description: 'Account management',
  roles: ['superadmin', 'admin', 'finance']
},
  { 
    icon: Icons.Game, 
    label: 'Fast Bingo', 
    path: '/game-config',
    description: 'Game configuration',
    roles: ['superadmin', 'admin', 'moderator', 'support', 'viewer']
  },
  { 
    icon: Icons.Rules, 
    label: 'Rules', 
    path: '/main-bingo-rules',
    description: 'Game rules',
    roles: ['superadmin', 'admin', 'moderator', 'support', 'viewer']
  },
  { 
    icon: Icons.Monitor, 
    label: 'Monitor', 
    path: '/main-bingo-monitor',
    description: 'Live monitoring',
    roles: ['superadmin', 'admin', 'moderator', 'support', 'viewer']
  },
  { 
    icon: Icons.Voice, 
    label: 'Voice', 
    path: '/voice-manager',
    description: 'Voice management',
    roles: ['superadmin', 'admin', 'moderator', 'viewer']
  },
  { 
    icon: Icons.History, 
    label: 'History', 
    path: '/game-monitor',
    description: 'Game history',
    roles: ['superadmin', 'admin', 'moderator', 'support', 'viewer']
  },
  { 
    icon: Icons.Settings, 
    label: 'Settings', 
    path: '/app-settings',
    description: 'Application settings',
    roles: ['superadmin', 'admin']
  },
  { 
    icon: Icons.CMS, 
    label: 'CMS', 
    path: '/cms',
    description: 'Content management',
    roles: ['superadmin', 'admin', 'moderator']
  },
];