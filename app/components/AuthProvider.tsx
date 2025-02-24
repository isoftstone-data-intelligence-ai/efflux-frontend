'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 不需要登录就可以访问的路由
const publicRoutes = ['/login', '/register'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      // 如果当前路径是公开路由，不需要检查
      if (publicRoutes.includes(pathname)) {
        return;
      }

      // 检查登录状态
      const token = localStorage.getItem('authToken');
      if (!token) {
        // 没有登录则跳转到登录页
        router.push('/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  // 如果是公开路由，直接显示内容
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // 对于需要保护的路由，检查登录状态
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('authToken');
  
  // 如果已登录，显示内容
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 未登录时不显示任何内容，等待重定向
  return null;
}
