import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../firebase';
import { CLASS_MEMBERS, TEACHER_ACCOUNTS } from '../data/mockData';

type UserRole = 'student' | 'teacher' | 'admin' | null;

interface UserProfile {
  uid: string;
  role: UserRole;
  fullName: string;
  grade?: string;
  email: string;
}

interface AuthContextType {
  userRole: UserRole;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, fullName: string, grade?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
  updateUserRole: (newRole: UserRole) => Promise<void>;
  isLoading: boolean;
  isAdminOrTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for mock user in localStorage first
    const savedMockUser = localStorage.getItem('mockUser');
    if (savedMockUser) {
      const profile = JSON.parse(savedMockUser);
      setUser(profile);
      setUserRole(profile.role);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUser(profile);
          setUserRole(profile.role);
        } else {
          // If user exists in Auth but not in Firestore (e.g. social login first time)
          // We might need to handle this in the login function or redirect to a profile setup
          setUser(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check for mock accounts first (students and teachers)
      const allMockMembers = [...CLASS_MEMBERS, ...TEACHER_ACCOUNTS];
      const mockMember = allMockMembers.find(m => m.username === email && m.password === password);
      
      if (mockMember) {
        const profile: UserProfile = {
          uid: `mock-${mockMember.id}`,
          role: mockMember.mockRole || 'student',
          fullName: mockMember.name,
          email: mockMember.email || `${mockMember.username?.replace(/\s+/g, '').toLowerCase()}@lop6c.edu.vn`,
          grade: '6'
        };
        setUser(profile);
        setUserRole(profile.role);
        localStorage.setItem('mockUser', JSON.stringify(profile));
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        setUser(profile);
        setUserRole(profile.role);
      } else {
        throw new Error('Hồ sơ người dùng không tồn tại trong hệ thống.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, role: UserRole, fullName: string, grade?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const profile: UserProfile = {
        uid: userCredential.user.uid,
        role,
        fullName,
        email,
        grade
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), profile);
      setUser(profile);
      setUserRole(role);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleSocialLogin(result.user);
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error('Google login error:', error);
        throw error;
      }
    }
  };

  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await handleSocialLogin(result.user);
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error('Facebook login error:', error);
        throw error;
      }
    }
  };

  const handleSocialLogin = async (firebaseUser: FirebaseUser) => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      const profile = userDoc.data() as UserProfile;
      setUser(profile);
      setUserRole(profile.role);
    } else {
      // Default to student if first time social login
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        role: 'student',
        fullName: firebaseUser.displayName || 'Học sinh mới',
        email: firebaseUser.email || '',
        grade: '6'
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      setUser(profile);
      setUserRole('student');
    }
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    return signOut(auth);
  };

  const updateUserRole = async (newRole: UserRole) => {
    if (!user || !newRole) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { ...user, role: newRole }, { merge: true });
      setUser({ ...user, role: newRole });
      setUserRole(newRole);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const isAdminOrTeacher = userRole === 'teacher' || userRole === 'admin';

  return (
    <AuthContext.Provider value={{ 
      userRole, 
      user, 
      login, 
      register, 
      loginWithGoogle, 
      loginWithFacebook, 
      logout, 
      updateUserRole,
      isLoading,
      isAdminOrTeacher
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
