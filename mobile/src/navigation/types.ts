export type Route =
  | { name: 'Home' }
  | { name: 'Search'; query?: string }
  | { name: 'Browse'; quarter?: string }
  | { name: 'LandDetail'; id: string }
  | { name: 'About' }
  | { name: 'Login' }
  | { name: 'Register' }
  | { name: 'ForgotPassword' }
  | { name: 'ResetPassword'; token?: string }
  | { name: 'Profile' }
  | { name: 'AdminDashboard' }
  | { name: 'ManageLands' }
  | { name: 'UploadLand' }
  | { name: 'EditLand'; id: string }
  | { name: 'AdminUsers' }
  | { name: 'AuditLogs'; landId: string; titleNumber?: string }
  | { name: 'NotFound' };

export type RouteName = Route['name'];
