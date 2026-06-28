'use client';
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Award,
  Search,
  SlidersHorizontal,
  ChevronRight,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  HelpCircle,
  Bell,
  Heart,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Settings,
  LogOut,
  Sparkles,
  Check,
  UserPlus,
  Plus,
  ArrowRight,
  Filter,
  Volume2,
  FolderSync,
  History,
  X,
  MessageSquare,
  Edit,
  Trash2,
  Info,
  XCircle,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import {
  checkSupabaseStatus,
  fetchOpportunities,
  fetchEvents,
  fetchTalents,
  fetchApplications,
  fetchSettings,
  saveOpportunity,
  saveEvent,
  removeEvent,
  saveTalent,
  removeTalent,
  saveApplication,
  removeApplication,
  saveSettings,
  SQL_MIGRATION_SCRIPT,
  EventItem
} from '../lib/supabaseSync';
import { getSupabaseClient } from '../lib/supabase';


// Initial Mock Opportunities Data for Portal do Voluntário
const INITIAL_OPPORTUNITIES = [
  {
    id: 1,
    title: 'Inclusão Digital para Idosos',
    category: 'Educação',
    distance: '2.4km',
    duration: '4h / sem',
    filled: 34,
    total: 40,
    description: 'Ajude idosos a se conectarem com suas famílias através da tecnologia em oficinas práticas semanais.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1k9HKrN7jYYa9W5oE6AomFA_rC-Nl9o5MAawGsCaf54qYjWBgW_ZGyfHKMcqM9dD-ECbS20ZL4gvqRmWu7yb8wvwSkRZEJHXgLTK3Xa7itb7z_jFw_n3uJXsTw_j5Rc4-7-kAp00jEhQJL47e82vT_sEvCWRtCmIDy8DQqsZH5YXQ8PWhl0Q2YBiX7R6XrvIP30lbUy9FohHVzqDzKdzKAWsM3reZjKvk6UUSGUwiyMxqx2gFUju7jgvpU3y8V7sRApgZ9fX2-Dk'
  },
  {
    id: 2,
    title: 'Horta Comunitária Urbana',
    category: 'Meio Ambiente',
    distance: '1.8km',
    duration: 'Flexível',
    filled: 60,
    total: 60,
    description: 'Participe da manutenção e colheita da nossa horta que alimenta mais de 50 famílias no bairro.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlbZwS_C_Ji2zG7AMI8REPiYHjlpFeqxI0f5gDAdm8YLKs-Saz8SXdzXi9nE8HMcDCYdbXCafDEtcQpU6ybhHIV0FDcchq2VM066LCSD_0WEkZgiJfgahBl9C9lynuw5NfxxoHEwP9-hoWBm6lxXD2T0mx9h7yndWjFyXKghByLYBzIEsL73bXBnIY7KDVaQBfX9jTgiPsBNPbGkJ2yyFqNKp1XQa1PTymacSAb1v-zpHtzO6FaI-pvjv-G2EDBk8AxnjvwufnCGs'
  },
  {
    id: 3,
    title: 'Apoio em Triagem Médica',
    category: 'Saúde',
    distance: '5.0km',
    duration: '8h / sem',
    filled: 5,
    total: 12,
    description: 'Auxilie nossa equipe médica na organização e triagem de pacientes em mutirões de saúde preventiva.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYQLwpGpXF6IZNgnJaGXajSp7d1mWfdVVOjf6sbbHCVkHRQBEbjCfAw3vImYTltbMeQfH5fjxbbhSpLwhC1BjaUm0Mn1qkN88vM-toR5NPuHgyU6TSNN8ks7IIVm5UVvy95guLCOUWHwbnuWMOnlEY9se6411JBvK0kn_vPxz3DW7a5G20UqE4ysi2zi-ZJNPgRRwgc-p-yeAU0u94Wirgsm3Vv9VDyqGHrscXk7B9pcBnvLS81KKwfWx4QiLkNlS09eAyG6hMADM'
  }
];

// Initial Custom Events Data for Central de Eventos
const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Almoço Solidário: Vila Esperança',
    category: 'Educação',
    badge: 'Aberto',
    date: '24 de Outubro, 2024 às 11:00',
    location: 'Rua dos Gerânios, 120 - Vila Esperança',
    progress: 85,
    filled: 34,
    total: 40,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaIguAj6u9PW3CYsbbeqkoet87LI7trbl0ujjT2Jj2cCXFpXLxoDTrHLhi6Q--ir08txnQtcjGqzY2USjawvu-LBvgD14wqoObKdXcFnHp-JpQOu-9e-1SA1JzQmwxr2wErFrhjerK7jHSVBEDO31HaU83wmRjyCgoQwK9OtZHsReJ5s3crG7wIEq2-U0N0I-wmfGxHw1pD7FLgoUUsdrVJPkQLdDCosu9R39JybCtNyeXjG51Rojd2AztjADFrCpBGvK56PJh3Ec',
    admins: 'admin@ong.org'
  },
  {
    id: 2,
    title: 'Reflorestamento Comunitário',
    category: 'Meio Ambiente',
    badge: 'Em andamento',
    date: 'Hoje, 09:00 - 17:00',
    location: 'Parque da Cidade, Setor Sul',
    progress: 100,
    filled: 60,
    total: 60,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6_Yrb8qa_ii2DryaddxrJPEvSD1IUmpDwbd69NtHFS5_GCMqhMQHxh5RbQv_d01uh9p7Dafjy5UkeV_A7feUz6YWVJbsg_FN3WjHCVjdH_n_e2nBjZvOrtDy0GbDMwmNXmPBAMRiybSVFrP-Fn6z-BUxIytq0heXElbbfNy4kkeum_etjnNGbNZPIMJzDlNH4v8vkNqGAyjcpcow0w7833kgrTSc2VkZOO9Fu_IffGY_wmDuqna1IrkZG4A6EmY_0aFOlZsyYHOQ',
    admins: 'admin@ong.org'
  },
  {
    id: 3,
    title: 'Workshop: Alfabetização Digital',
    category: 'Saúde',
    badge: 'Aberto',
    date: '12 de Novembro, 2024 às 14:00',
    location: 'Biblioteca Municipal - Auditório B',
    progress: 42,
    filled: 5,
    total: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALoZt4bzys-kpc1E2vGbhOXlqfP_WPMxf4P_mNNT_7rJ_EfkODzqG6cIeVNb6howgkW6xwvEogKU78P29C-5bCqg82oZpj3QyY6-4JGsspDvguS011jznOnH1QpZslac5IVIQUOEYKUDOveadt9rfPXjHpQtGdoWD8eFQS5jIpQJ7hNIu43v8rNNLXZe7Wwe3idAIuRDnkcjY0TISkGgj4wzPgcpOrkffFCJYlgVok-vXrJ6JxDE7PjmLVVXD8OHElt4_H79MFSko',
    admins: 'admin@ong.org'
  }
];

// Initial Talent Database Data
const INITIAL_TALENTS = [
  {
    id: 1,
    name: 'Ana Clara Mendes',
    email: 'ana.clara@gmail.com',
    skills: ['Design UX/UI', 'Ilustração'],
    availability: 'Fins de semana',
    projects: 12,
    rating: 4.9,
    progress: 85,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSnNF9VP6oCiIM8ihtFQDw0XFFZ70_Zgk9rPUqtI7Tx7hJVllttyGaSHvlL7-10cYSbYWWPKxeccOTsaPa4gRuEeUsCNbwFOZQCaOlDAe2OH-2-ey7eQc8UMmmAKtvpvLv2ZDctavtMGFujXWYVdWhB9A_wcL7vJPVH8-aq2kmHNb3SDURZR3iG9Q0B0WhncK1kVhOhfGWxdTRUy6Jm3uMloRJoYkesv8qKilUhITnpzKgUsRolcOGQjbQXUV-WL8ncgM_3vAaQMQ'
  },
  {
    id: 2,
    name: 'Carlos Eduardo Pereira',
    email: 'carlos.ed@outlook.com',
    skills: ['Culinária', 'Logística'],
    availability: 'Noites (Seg-Sex)',
    projects: 45,
    rating: 5.0,
    progress: 100,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJD0VTJLjzlov8DhQWLDxpTKYVVv5_FUUNubIQsNGNIiR_qKawRIAg8iDq7QCOHc_Ew7JBUUk6sMFDe-AVrpLEWQ3Bgbxq9KSDwo0gdbBX2HC3_fbp_eH_8JdFpN-RQfnxB03OtHLvxbBsvndriUfzMXsKIU0xLp9oUxWcIbNotfJfvXhl5RD4HbNOY6IRR0AoAclsHgopZcjb6EV8iq5HNIOKy8_l3D-GozGYUfFthkZ5X1pXs16KVP7CEciYYkliWsI-LLVgd3I'
  },
  {
    id: 3,
    name: 'Beatriz Souza',
    email: 'beatriz.souza@uol.com.br',
    skills: ['Psicologia', 'Escuta Ativa'],
    availability: 'Manhãs',
    projects: 8,
    rating: 4.8,
    progress: 40,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfDeDo-d8OPNfA2kZkW_P0RqwzeV5BZe6cvf0Lc1w4jgYu0A7u54rshB5Urk_4sqgOZhZwnnTfSOpoehaCn3bQWNJDT3SQKqOj4s9KBbxWyPNczlIu6yry6ucKAqYv65nwmit35CgSTqLaBVNzaAcCspWA6ilt7Y1FE2WSEgRLXuzvkn0aK4UPxXwfhp44i-NqxfomlUEWHsfYtlNa7Gjrx7E24dxYf1l5Kq_L3IVhR0beQ94UpzbEgbidG-fFI_dvtSF9PFl9CHc'
  },
  {
    id: 4,
    name: 'Roberto Lima',
    email: 'roberto.dev@live.com',
    skills: ['T.I.', 'Eletrotécnica'],
    availability: 'Sob-demanda',
    projects: 22,
    rating: 4.7,
    progress: 75,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWYHmaLe9A0eIAOMYBD-uKtmU6Ikiq0q91kPCOh9dQp80dyn0PqU2601DCOMNOTL9x0uLsnHJkBs4koeozCxZLGLeeromfGHv_4kl9XTKNo_iFVS52xqno0o06gbHVSMZPZN3QU3_dcBOeZTSuz6_2J-rBDD--9JjOm-pGJBMUgr9QXLaX_zzbZAhcgYjlePxDT5UyZ4YmGbQS6fGqluSQhcbXBGcFEvaIZWEZEepphbFeaP4bE0i62c85NC6iQm2dfQh_Qip3xU'
  }
];

function generateUniqueId(): number {
  return Date.now();
}

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const loggedIn = localStorage.getItem('vol_admin_logged_in') === 'true';
        if (loggedIn) {
          setIsLoggedIn(true);
          const email = localStorage.getItem('vol_admin_email') || 'admin@ong.org';
          setCurrentUserEmail(email);
        }
      }
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const hasEventPermission = (eventAdmins?: string) => {
    if (!isLoggedIn) return false;
    const email = currentUserEmail || 'admin@ong.org';
    if (email === 'admin@ong.org') return true; // Local bypass has full rights
    if (!eventAdmins) return true; // Allow by default if no admins are set
    const adminList = eventAdmins.split(',').map(item => item.trim().toLowerCase());
    return adminList.includes(email.toLowerCase());
  };

  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    const username = loginUser.trim();

    // Registration Mode logic
    if (isRegisterMode) {
      const supabase = getSupabaseClient() as any;
      if (!supabase) {
        setLoginError('Supabase não configurado. Não é possível se registrar.');
        showToastMsg('Erro de configuração!', 'error');
        setIsSubmitting(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: username,
          password: loginPassword,
        });

        if (error) {
          setLoginError(`Erro no cadastro: ${error.message}`);
          showToastMsg('Erro no cadastro!', 'error');
        } else if (data?.user) {
          showToastMsg('Cadastro realizado com sucesso!', 'success');
          // Automatically log them in if session is immediately available
          setIsLoggedIn(true);
          localStorage.setItem('vol_admin_logged_in', 'true');
          localStorage.setItem('vol_admin_email', data.user.email || username);
          setCurrentUserEmail(data.user.email || username);
          setLoginPassword('');
          setLoginUser('');
          setIsRegisterMode(false);
        } else {
          setLoginError('Não foi possível concluir o cadastro.');
          showToastMsg('Erro no cadastro!', 'error');
        }
      } catch (err: any) {
        console.error('Sign up exception:', err);
        setLoginError(`Erro inesperado: ${err.message || err}`);
        showToastMsg('Erro de conexão!', 'error');
      }
      setIsSubmitting(false);
      return;
    }

    // 1. Try local admin bypass
    if (username.toLowerCase() === 'admin' && loginPassword === 'admin') {
      setIsLoggedIn(true);
      localStorage.setItem('vol_admin_logged_in', 'true');
      localStorage.setItem('vol_admin_email', 'admin@ong.org');
      setCurrentUserEmail('admin@ong.org');
      showToastMsg('Login efetuado com sucesso (Administrador Local)!', 'success');
      setLoginPassword('');
      setLoginUser('');
      setIsSubmitting(false);
      return;
    }

    // 2. Try Supabase Auth if client is available
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: loginPassword,
        });

        if (error) {
          setLoginError(`Erro de autenticação no Supabase: ${error.message}`);
          showToastMsg('Erro na autenticação!', 'error');
        } else if (data?.user) {
          setIsLoggedIn(true);
          localStorage.setItem('vol_admin_logged_in', 'true');
          localStorage.setItem('vol_admin_email', data.user.email || '');
          setCurrentUserEmail(data.user.email || '');
          showToastMsg(`Bem-vindo, ${data.user.email || 'Usuário'}!`, 'success');
          setLoginPassword('');
          setLoginUser('');
        } else {
          setLoginError('Usuário ou senha incorretos.');
          showToastMsg('Erro na autenticação!', 'error');
        }
      } catch (err: any) {
        console.error('Login exception:', err);
        setLoginError(`Falha inesperada ao conectar com o Supabase: ${err.message || err}`);
        showToastMsg('Erro de conexão!', 'error');
      }
    } else {
      setLoginError('Supabase não configurado. Use "admin" e "admin" para acesso local.');
      showToastMsg('Erro de configuração!', 'error');
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserEmail(null);
    localStorage.removeItem('vol_admin_logged_in');
    localStorage.removeItem('vol_admin_email');
    showToastMsg('Sessão encerrada com sucesso.', 'info');
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'eventos' | 'voluntarios' | 'talentos'>('dashboard');
  
  const [settingsForm, setSettingsForm] = useState({
    ongName: 'Agenda Solidaria',
    contactEmail: 'agenda.solidaria@ong.org',
    targetHours: 5000,
    notifyOnNewSignup: true,
    enableSoundAlerts: true
  });
  
  // Supabase Sync States
  const [supabaseStatus, setSupabaseStatus] = useState<{ success: boolean; needsMigration?: boolean; reason?: string } | null>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [supabaseSourceInfo, setSupabaseSourceInfo] = useState<{
    opportunities: 'supabase' | 'fallback';
    events: 'supabase' | 'fallback';
    talents: 'supabase' | 'fallback';
    applications: 'supabase' | 'fallback';
    settings: 'supabase' | 'fallback';
  }>({
    opportunities: 'fallback',
    events: 'fallback',
    talents: 'fallback',
    applications: 'fallback',
    settings: 'fallback',
  });

  // Simulated Interactive States
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [talents, setTalents] = useState(INITIAL_TALENTS);
  
  // Dynamic stats
  const [activeVolunteerCount, setActiveVolunteerCount] = useState(1248);
  const [metricsHours, setMetricsHours] = useState(3450);
  const [metricsCompletedEvents, setMetricsCompletedEvents] = useState(42);
  const [myApplications, setMyApplications] = useState([
    { id: 1, title: 'Alfabetização Adultos', time: 'Sábados, 14:00', icon: 'book', status: 'verified', type: 'primary' },
    { id: 2, title: 'Plantio Comunitário', time: 'Próx. Domingo', icon: 'flower', status: 'clock', type: 'tertiary' }
  ]);

  // Check and Sync Supabase
  const loadAndSyncSupabase = async () => {
    setIsLoadingSupabase(true);
    try {
      const status = await checkSupabaseStatus();
      setSupabaseStatus(status);

      if (status.success && !status.needsMigration) {
        // Fetch settings first
        const settingsRes = await fetchSettings(settingsForm);
        if (settingsRes.source === 'supabase') {
          setSettingsForm(settingsRes.data);
        }

        // Fetch opportunities
        const oppsRes = await fetchOpportunities(INITIAL_OPPORTUNITIES);
        setOpportunities(oppsRes.data);

        // Fetch events
        const eventsRes = await fetchEvents(INITIAL_EVENTS);
        setEvents(eventsRes.data);

        // Fetch talents
        const talentsRes = await fetchTalents(INITIAL_TALENTS);
        setTalents(talentsRes.data);

        // Fetch applications
        const appsRes = await fetchApplications([
          { id: 1, title: 'Alfabetização Adultos', time: 'Sábados, 14:00', icon: 'book', status: 'verified', type: 'primary' },
          { id: 2, title: 'Plantio Comunitário', time: 'Próx. Domingo', icon: 'flower', status: 'clock', type: 'tertiary' }
        ]);
        setMyApplications(appsRes.data);

        // Update source tracking state
        setSupabaseSourceInfo({
          opportunities: oppsRes.source,
          events: eventsRes.source,
          talents: talentsRes.source,
          applications: appsRes.source,
          settings: settingsRes.source,
        });

        // Seed if empty
        const { seedSupabaseIfNeeded } = await import('../lib/supabaseSync');
        await seedSupabaseIfNeeded(INITIAL_OPPORTUNITIES, INITIAL_EVENTS, INITIAL_TALENTS);
      }
    } catch (err) {
      console.error('Error during Supabase sync:', err);
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      const timer = setTimeout(() => {
        loadAndSyncSupabase();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isHydrated]);

  // Filters State
  const [oppFilter, setOppFilter] = useState('Todos');
  const [talentFilter, setTalentFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals States
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showNewTalentModal, setShowNewTalentModal] = useState(false);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [appliedItemTitle, setAppliedItemTitle] = useState('');

  // Edit Modals and Form States
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editingTalent, setEditingTalent] = useState<any | null>(null);
  const [showEditTalentModal, setShowEditTalentModal] = useState(false);

  // Delete Custom Confirmation States
  const [eventToDelete, setEventToDelete] = useState<any | null>(null);
  const [talentToDelete, setTalentToDelete] = useState<any | null>(null);
  const [appToCancel, setAppToCancel] = useState<any | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToastMsg = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  // Extended interactive states for settings, notifications, help, profile
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Falta de Voluntários', text: 'O evento "Sopão Solidário - Centro" tem apenas 3/10 voluntários.', time: '2h atrás', type: 'error', read: false },
    { id: 2, title: 'Aprovação Pendente', text: '8 novos perfis aguardam aprovação para "Alfabetização Digital".', time: '5h atrás', type: 'warning', read: false },
    { id: 3, title: 'Inscrição Confirmada', text: 'Seu cadastro de perfil como voluntário foi atualizado!', time: '1 dia atrás', type: 'success', read: true }
  ]);

  // New Event Form State
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    category: 'Educação',
    date: '',
    location: '',
    total: 20,
    admins: ''
  });

  // New Talent Form State
  const [newTalentForm, setNewTalentForm] = useState({
    name: '',
    email: '',
    skills: '',
    availability: 'Fins de semana'
  });

  // Sound and notification triggering effect
  const handleApply = (opp: typeof INITIAL_OPPORTUNITIES[0]) => {
    // Increment stats on apply
    setOpportunities(prev => prev.map(item => {
      if (item.id === opp.id && item.filled < item.total) {
        const updatedItem = { ...item, filled: item.filled + 1 };
        saveOpportunity(updatedItem);
        return updatedItem;
      }
      return item;
    }));
    
    // Add to My Inscriptions if not already added
    if (!myApplications.some(app => app.title === opp.title)) {
      const newApp = {
        id: generateUniqueId(),
        title: opp.title,
        time: opp.duration,
        icon: opp.category === 'Educação' ? 'book' : opp.category === 'Saúde' ? 'stethoscope' : 'flower',
        status: 'verified',
        type: opp.category === 'Educação' ? 'primary' : opp.category === 'Saúde' ? 'secondary' : 'tertiary'
      };
      setMyApplications(prev => [...prev, newApp]);
      saveApplication(newApp);
      setMetricsHours(prev => prev + 4);
      setActiveVolunteerCount(prev => prev + 1);
    }
    
    setAppliedItemTitle(opp.title);
    setShowApplySuccess(true);
  };

  // Submit New Event Handler
  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title || !newEventForm.date || !newEventForm.location) {
      showToastMsg('Por favor, preencha todos os campos do evento!', 'error');
      return;
    }

    const creatorEmail = currentUserEmail || 'admin@ong.org';
    const otherAdmins = newEventForm.admins ? newEventForm.admins.split(',').map(item => item.trim()).filter(Boolean).join(', ') : '';
    const finalAdminsList = otherAdmins ? `${creatorEmail}, ${otherAdmins}` : creatorEmail;

    const createdEvent = {
      id: generateUniqueId(),
      title: newEventForm.title,
      category: newEventForm.category,
      badge: 'Aberto',
      date: newEventForm.date,
      location: newEventForm.location,
      progress: 0,
      filled: 0,
      total: Number(newEventForm.total),
      admins: finalAdminsList,
      image: newEventForm.category === 'Educação' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaIguAj6u9PW3CYsbbeqkoet87LI7trbl0ujjT2Jj2cCXFpXLxoDTrHLhi6Q--ir08txnQtcjGqzY2USjawvu-LBvgD14wqoObKdXcFnHp-JpQOu-9e-1SA1JzQmwxr2wErFrhjerK7jHSVBEDO31HaU83wmRjyCgoQwK9OtZHsReJ5s3crG7wIEq2-U0N0I-wmfGxHw1pD7FLgoUUsdrVJPkQLdDCosu9R39JybCtNyeXjG51Rojd2AztjADFrCpBGvK56PJh3Ec'
        : newEventForm.category === 'Meio Ambiente'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6_Yrb8qa_ii2DryaddxrJPEvSD1IUmpDwbd69NtHFS5_GCMqhMQHxh5RbQv_d01uh9p7Dafjy5UkeV_A7feUz6YWVJbsg_FN3WjHCVjdH_n_e2nBjZvOrtDy0GbDMwmNXmPBAMRiybSVFrP-Fn6z-BUxIytq0heXElbbfNy4kkeum_etjnNGbNZPIMJzDlNH4v8vkNqGAyjcpcow0w7833kgrTSc2VkZOO9Fu_IffGY_wmDuqna1IrkZG4A6EmY_0aFOlZsyYHOQ'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuALoZt4bzys-kpc1E2vGbhOXlqfP_WPMxf4P_mNNT_7rJ_EfkODzqG6cIeVNb6howgkW6xwvEogKU78P29C-5bCqg82oZpj3QyY6-4JGsspDvguS011jznOnH1QpZslac5IVIQUOEYKUDOveadt9rfPXjHpQtGdoWD8eFQS5jIpQJ7hNIu43v8rNNLXZe7Wwe3idAIuRDnkcjY0TISkGgj4wzPgcpOrkffFCJYlgVok-vXrJ6JxDE7PjmLVVXD8OHElt4_H79MFSko'
    };

    setEvents([createdEvent, ...events]);
    saveEvent(createdEvent);
    setNewEventForm({
      title: '',
      category: 'Educação',
      date: '',
      location: '',
      total: 20,
      admins: ''
    });
    setShowNewEventModal(false);
    showToastMsg('Novo mutirão cadastrado com sucesso!', 'success');
  };

  // Submit New Talent Handler
  const handleCreateTalentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTalentForm.name || !newTalentForm.email || !newTalentForm.skills) {
      showToastMsg('Favor preencher o nome, email e habilidades!', 'error');
      return;
    }

    const createdTalent = {
      id: generateUniqueId(),
      name: newTalentForm.name,
      email: newTalentForm.email,
      skills: newTalentForm.skills.split(',').map(s => s.trim()),
      availability: newTalentForm.availability,
      projects: 0,
      rating: 5.0,
      progress: 0,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCywtFM2m9sy6xD0YtB6Tz9O0F2fStg1HKaRTqao-yNNLqXTsam7DX7pxc-I16J5rF8PSjygaXsbzLm4QSNClm2sRlfd7-mIegg-4mLIPYeBtawabn7vkWJO9xlD1eAnJeGsESVbtqStRUhLN1lbhVRfI_yX7VLS8OmKDKWZ7jL9uV79EDy3qzJvpDgWMSq9n1MZYe_E0tLMNJPHuS8LnI8ET5CpzswBflrauV3C7T9W0JFeiw7jlJYaZ1GV8ReMiSu24uMBK2Cuek'
    };

    setTalents([createdTalent, ...talents]);
    saveTalent(createdTalent);
    setActiveVolunteerCount(prev => prev + 1);
    setNewTalentForm({
      name: '',
      email: '',
      skills: '',
      availability: 'Fins de semana'
    });
    setShowNewTalentModal(false);
    showToastMsg('Voluntário cadastrado com sucesso!', 'success');
  };

  // Submit Edit Event Handler
  const handleEditEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent.title || !editingEvent.date || !editingEvent.location) {
      showToastMsg('Por favor, preencha todos os campos do evento!', 'error');
      return;
    }

    const originalEvent = events.find(ev => ev.id === editingEvent.id);
    const updatedEvent = { ...originalEvent, ...editingEvent, total: Number(editingEvent.total) };

    setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updatedEvent : ev));
    saveEvent(updatedEvent);
    setShowEditEventModal(false);
    setEditingEvent(null);
    showToastMsg('Mutirão atualizado com sucesso!', 'success');
  };

  // Delete Event Handler
  const handleDeleteEvent = (eventId: number) => {
    const ev = events.find(item => item.id === eventId);
    if (ev) {
      setEventToDelete(ev);
    }
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      if (!hasEventPermission(eventToDelete.admins)) {
        showToastMsg('Erro: Você não tem permissão para excluir este evento.', 'error');
        setEventToDelete(null);
        return;
      }
      setEvents(prev => prev.filter(ev => ev.id !== eventToDelete.id));
      removeEvent(eventToDelete.id);
      showToastMsg(`Mutirão "${eventToDelete.title}" excluído com sucesso!`, 'success');
      setEventToDelete(null);
    }
  };

  // Submit Edit Talent Handler
  const handleEditTalentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTalent.name || !editingTalent.email || !editingTalent.skills) {
      showToastMsg('Favor preencher o nome, email e habilidades!', 'error');
      return;
    }

    const updatedSkills = typeof editingTalent.skills === 'string'
      ? editingTalent.skills.split(',').map((s: string) => s.trim())
      : editingTalent.skills;

    const originalTalent = talents.find(t => t.id === editingTalent.id);
    const updatedTalent = { ...originalTalent, ...editingTalent, skills: updatedSkills };

    setTalents(prev => prev.map(t => t.id === editingTalent.id ? updatedTalent : t));
    saveTalent(updatedTalent);
    setShowEditTalentModal(false);
    setEditingTalent(null);
    showToastMsg('Cadastro de voluntário atualizado com sucesso!', 'success');
  };

  // Delete Talent Handler
  const handleDeleteTalent = (talentId: number) => {
    const t = talents.find(item => item.id === talentId);
    if (t) {
      setTalentToDelete(t);
    }
  };

  const confirmDeleteTalent = () => {
    if (talentToDelete) {
      setTalents(prev => prev.filter(t => t.id !== talentToDelete.id));
      removeTalent(talentToDelete.id);
      setActiveVolunteerCount(prev => Math.max(0, prev - 1));
      showToastMsg(`Voluntário "${talentToDelete.name}" excluído com sucesso!`, 'success');
      setTalentToDelete(null);
    }
  };

  const confirmCancelApplication = () => {
    if (appToCancel) {
      setMyApplications(prev => prev.filter(item => item.id !== appToCancel.id));
      removeApplication(appToCancel.id);
      setActiveVolunteerCount(prev => Math.max(0, prev - 1));
      setMetricsHours(prev => Math.max(0, prev - 4));
      showToastMsg(`Inscrição em "${appToCancel.title}" cancelada!`, 'info');
      setAppToCancel(null);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#FAF9F6] to-[#FAF9F6] p-gutter relative font-sans text-on-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-outline animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-surface-container bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#FAF9F6] to-[#FAF9F6] p-gutter relative font-sans text-on-surface">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-[440px] bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-outline-variant/40"
          >
            {/* Header / Logo */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-4 shadow-lg shadow-primary/20">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h2 className="font-atkinson text-3xl font-bold text-primary leading-tight">{settingsForm.ongName}</h2>
              <p className="text-xs font-semibold text-outline uppercase tracking-wider mt-1">
                {isRegisterMode ? 'Cadastro de Novo Usuário' : 'Plataforma de Gestão de Impacto'}
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-error-container/25 border border-error/20 rounded-xl flex items-start gap-3 overflow-hidden"
                >
                  <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <p className="text-body-sm text-error font-medium leading-tight">{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login / Register Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    value={loginUser}
                    onChange={(e) => {
                      setLoginUser(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="exemplo@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-[#FAF9F6]/50 focus:bg-white transition-all outline-none" 
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-[#FAF9F6]/50 focus:bg-white transition-all outline-none" 
                    required
                    disabled={isSubmitting}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-primary transition-colors cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot - simulated */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" defaultChecked />
                  <span>Lembrar-me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{isRegisterMode ? 'Cadastrando...' : 'Autenticando...'}</span>
                  </>
                ) : (
                  <span>{isRegisterMode ? 'Criar Conta e Entrar' : 'Entrar no Sistema'}</span>
                )}
              </button>

              {/* Mode Switcher */}
              <div className="text-center mt-6 text-xs font-semibold text-outline">
                {isRegisterMode ? (
                  <p>
                    Já tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(false);
                        setLoginError('');
                      }}
                      className="text-primary hover:underline font-bold cursor-pointer"
                    >
                      Entre aqui
                    </button>
                  </p>
                ) : (
                  <p>
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true);
                        setLoginError('');
                      }}
                      className="text-primary hover:underline font-bold cursor-pointer"
                    >
                      Registre-se
                    </button>
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        {/* FLOATING TOAST NOTIFICATION DURING LOGIN SCREEN */}
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-xs border font-sans text-xs font-semibold ${
              toast.type === 'success' 
                ? 'bg-[#e6f4ea] text-[#137333] border-[#137333]/20' 
                : toast.type === 'error' 
                ? 'bg-[#fce8e6] text-[#c5221f] border-[#c5221f]/20' 
                : 'bg-[#e8f0fe] text-[#1a73e8] border-[#1a73e8]/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#137333]" />
              ) : toast.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-[#c5221f]" />
              ) : (
                <Info className="w-4 h-4 text-[#1a73e8]" />
              )}
              <span>{toast.message}</span>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="ml-4 h-5 w-5 hover:bg-black/5 rounded flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="relative min-h-screen bg-background">
        <div className="min-h-screen bg-background text-on-surface font-sans antialiased flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex flex-col bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant p-sm shrink-0 md:fixed md:top-0 md:bottom-0 md:left-0 z-50">
        <div className="mb-md p-xs flex items-center gap-xs">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="font-atkinson text-headline-md font-bold text-primary leading-tight">{settingsForm.ongName}</h1>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Gestão de Impacto</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-sm px-sm py-2 rounded-lg text-left transition-all ${
              activeTab === 'dashboard'
                ? 'text-primary font-bold border-r-4 border-primary bg-surface-container'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-body-sm font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('eventos')}
            className={`w-full flex items-center gap-sm px-sm py-2 rounded-lg text-left transition-all ${
              activeTab === 'eventos'
                ? 'text-primary font-bold border-r-4 border-primary bg-surface-container'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-body-sm font-medium">Central de Eventos</span>
          </button>

          <button
            onClick={() => setActiveTab('voluntarios')}
            className={`w-full flex items-center gap-sm px-sm py-2 rounded-lg text-left transition-all ${
              activeTab === 'voluntarios'
                ? 'text-primary font-bold border-r-4 border-primary bg-surface-container'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-body-sm font-medium">Portal do Voluntário</span>
          </button>

          <button
            onClick={() => setActiveTab('talentos')}
            className={`w-full flex items-center gap-sm px-sm py-2 rounded-lg text-left transition-all ${
              activeTab === 'talentos'
                ? 'text-primary font-bold border-r-4 border-primary bg-surface-container'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-body-sm font-medium">Banco de Talentos</span>
          </button>
        </nav>

        {/* Supabase Status Indicator Card */}
        <div className="mt-4 p-3 bg-surface-container/60 border border-outline-variant/30 rounded-xl font-sans shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Conexão Supabase</span>
            <span className={`w-2 h-2 rounded-full ${
              supabaseStatus?.success && !supabaseStatus?.needsMigration
                ? 'bg-emerald-500 animate-pulse'
                : supabaseStatus?.success && supabaseStatus?.needsMigration
                ? 'bg-amber-500 animate-pulse'
                : 'bg-rose-500 animate-pulse'
            }`} />
          </div>
          <p className="text-[11px] font-semibold text-on-surface leading-tight">
            {supabaseStatus?.success && !supabaseStatus?.needsMigration ? (
              <span className="text-emerald-700">Conectado (Real-Time)</span>
            ) : supabaseStatus?.success && supabaseStatus?.needsMigration ? (
              <span className="text-amber-700">Tabelas Pendentes</span>
            ) : (
              <span className="text-rose-700">Banco de Dados Offline</span>
            )}
          </p>
          <button 
            onClick={() => setShowSupabaseModal(true)}
            className="w-full mt-2 text-center text-[10px] font-bold text-primary hover:underline cursor-pointer"
          >
            Ver Configurações ↗
          </button>
        </div>

        <div className="mt-xs pt-md border-t border-outline-variant space-y-md">
          <button 
            onClick={() => {
              if (activeTab === 'talentos') {
                setShowNewTalentModal(true);
              } else {
                setShowNewEventModal(true);
              }
            }}
            className="w-full bg-primary text-on-primary py-2.5 px-md rounded-xl font-semibold text-body-sm flex items-center justify-center gap-xs hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            {activeTab === 'talentos' ? 'Convidar Voluntário' : 'Novo Evento'}
          </button>

          <div className="space-y-1">
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center gap-[12px] px-[16px] py-[10px] rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container/50 transition-colors text-left cursor-pointer"
            >
              <Settings className="w-5 h-5" />
              <span className="text-body-sm font-medium">Configurações</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-[12px] px-[16px] py-[10px] rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/10 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-body-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Framework Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top Header App Bar */}
        <header className="sticky top-0 right-0 w-full h-16 bg-white/95 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-gutter z-40">
          {/* Dynamic Interactive Search Bar */}
          <div className="flex items-center bg-surface-container-low px-sm py-1.5 rounded-full w-full max-w-sm group border border-transparent focus-within:border-primary/30 transition-all">
            <Search className="w-4 h-4 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none focus:ring-0 text-body-sm w-full ml-xs placeholder:text-outline/70"
              placeholder="Buscar voluntários, eventos ou interesses..."
            />
          </div>

          <div className="flex items-center gap-md relative">
            <div className="flex items-center gap-xs">
              <button 
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
                id="bell-icon"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
                )}
              </button>
              <button 
                onClick={() => setShowHelpModal(true)}
                className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            {/* Dynamic Notification Drawer Dropdown */}
            {showNotificationDropdown && (
              <div className="absolute right-[80px] top-[48px] w-80 bg-white border border-outline-variant/60 rounded-xl shadow-2xl z-50 p-4 font-sans text-on-surface">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant/30">
                  <h4 className="font-atkinson text-sm font-bold">Notificações</h4>
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({...n, read: true})));
                    }}
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    Marcar lidas
                  </button>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-lg border text-xs relative ${
                        n.read 
                          ? 'bg-surface-container/30 border-transparent text-on-surface-variant' 
                          : 'bg-primary-container/10 border-primary/20 text-on-surface font-semibold'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="font-bold text-[12px]">{n.title}</span>
                        <span className="text-[10px] text-outline">{n.time}</span>
                      </div>
                      <p className="text-on-surface-variant font-normal leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-outline text-xs py-4">Nenhuma notificação por enquanto.</p>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/30 text-center">
                  <button 
                    onClick={() => setShowNotificationDropdown(false)}
                    className="text-xs text-outline hover:text-on-surface font-semibold"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            <div className="h-8 w-[1px] bg-outline-variant"></div>
            
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-sm cursor-pointer group hover:opacity-90 active:scale-95 transition-all text-left bg-transparent border-none"
            >
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-body-sm text-on-surface leading-tight">Admin Principal</p>
                <p className="text-[12px] text-outline">agenda.solidaria@ong.org</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container relative group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYbtGmKqR1hX1AE9uz8m51NvTezcFMsrhD7SojWCNNrmqRnd3LCAI7HutKs4Ys9Mf2R7czdmq2MaH4NnFdRNJRtaVKV2Wr_2YubVlzSG-4fmqOKoIxW-6gJQBpt-hC-AD2j8uAq3rFNIi5ai9l-kscNLk9rPvag-p-Y9dNxC_dkmL-TSQSQr1ZaTzSKghm9xRDUEOtORJ6IBjYSN96p1mhyHmOhlNyXEZ557VMLXWGbQqmLg4C5BPvoadjnV6DTl24YDU2wRUs4NE"
                  alt="Admin Portrait"
                  fill
                  sizes="40px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        </header>

        {/* Content Portal Rendering Container */}
        <div className="p-gutter flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* TAB 1: DASHBOARD ADMINISTRATIVO */}
              {activeTab === 'dashboard' && (
                <div className="space-y-lg">
                  <header>
                    <h2 className="font-atkinson text-headline-lg font-bold text-on-surface">Dashboard de Impacto</h2>
                    <p className="text-body-md text-on-surface-variant">Confira o resumo das atividades e impacto direto gerados na comunidade.</p>
                  </header>

                  {/* Quantitative Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    <div className="bg-surface-container-lowest p-md rounded-xl card-shadow flex flex-col justify-between border border-transparent hover:border-primary/20 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="p-xs bg-primary/10 rounded-lg text-primary">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="text-secondary text-[12px] font-semibold flex items-center bg-secondary-container/20 px-2 py-0.5 rounded-full">
                          +12% <TrendingUp className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                      <div className="mt-md">
                        <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-widest leading-none">Voluntários Ativos</p>
                        <h3 className="font-atkinson text-headline-xl font-bold text-primary mt-1">{activeVolunteerCount}</h3>
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest p-md rounded-xl card-shadow flex flex-col justify-between border border-transparent hover:border-secondary/20 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="p-xs bg-secondary/10 rounded-lg text-secondary">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-secondary text-[12px] font-semibold flex items-center bg-secondary-container/20 px-2 py-0.5 rounded-full">
                          +5% <TrendingUp className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                      <div className="mt-md">
                        <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-widest leading-none">Horas este Mês</p>
                        <h3 className="font-atkinson text-headline-xl font-bold text-secondary mt-1">{metricsHours}h</h3>
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest p-md rounded-xl card-shadow flex flex-col justify-between border border-transparent hover:border-tertiary/20 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="p-xs bg-tertiary-container/10 rounded-lg text-tertiary">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-error text-[12px] font-semibold flex items-center bg-error-container/20 px-2 py-0.5 rounded-full">
                          -2% <TrendingDown className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                      <div className="mt-md">
                        <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-widest leading-none">Eventos Concluídos</p>
                        <h3 className="font-atkinson text-headline-xl font-bold text-tertiary mt-1">{metricsCompletedEvents}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Impact Chart & Urgent Alerts Block */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                    {/* Annual chart layout */}
                    <div className="lg:col-span-8 bg-surface-container-lowest p-md rounded-xl card-shadow flex flex-col min-h-[320px]">
                      <div className="flex justify-between items-center mb-md">
                        <h4 className="font-atkinson text-headline-md font-semibold text-on-surface">Impacto Social de 2024</h4>
                        <span className="text-outline text-body-sm font-medium">Gráfico Mensal</span>
                      </div>
                      <div className="flex-1 flex items-end justify-between gap-sm h-48 px-sm">
                        {[
                          { month: 'Jan', val: 35 },
                          { month: 'Fev', val: 55 },
                          { month: 'Mar', val: 65 },
                          { month: 'Abr', val: 40 },
                          { month: 'Mai', val: 75 },
                          { month: 'Jun', val: 50 },
                          { month: 'Jul', val: 95 }
                        ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-xs flex-1 group">
                            <div className="w-full bg-primary/10 rounded-t-lg relative h-36">
                              <div 
                                className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500 group-hover:bg-primary-container"
                                style={{ height: `${item.val}%` }}
                              ></div>
                            </div>
                            <span className="text-label-sm text-on-surface-variant">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alerts Panel */}
                    <div className="lg:col-span-4 bg-surface-container-lowest p-md rounded-xl card-shadow flex flex-col">
                      <div className="flex items-center gap-xs mb-md">
                        <AlertTriangle className="w-5 h-5 text-error" />
                        <h4 className="font-atkinson text-headline-md font-semibold text-on-surface">Alertas Urgentes</h4>
                      </div>
                      <div className="space-y-sm flex-1 overflow-y-auto max-h-72 pr-1">
                        <div className="p-sm bg-error-container/30 border-l-4 border-error rounded-r-lg">
                          <div className="flex justify-between mb-xs">
                            <span className="font-label-md text-on-error-container text-xs">Falta de Voluntários</span>
                            <span className="text-[10px] text-outline">2h atrás</span>
                          </div>
                          <p className="text-body-sm text-on-surface-variant">O evento &ldquo;Sopão Solidário - Centro&rdquo; tem apenas 3/10 voluntários.</p>
                          <button className="mt-xs text-error text-xs font-semibold hover:underline" onClick={() => showToastMsg('Notificação de emergência enviada para voluntários em um raio de 5km!', 'info')}>Mobilizar Agora</button>
                        </div>

                        <div className="p-sm bg-tertiary-container/10 border-l-4 border-tertiary rounded-r-lg">
                          <div className="flex justify-between mb-xs">
                            <span className="font-label-md text-tertiary text-xs">Aprovação Pendente</span>
                            <span className="text-[10px] text-outline">5h atrás</span>
                          </div>
                          <p className="text-body-sm text-on-surface-variant">8 novos perfis aguardam aprovação para &ldquo;Alfabetização Digital&rdquo;.</p>
                          <button className="mt-xs text-tertiary text-xs font-semibold hover:underline" onClick={() => setActiveTab('talentos')}>Ver Candidatos</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Row and Recent Volunteer application requests */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                    <div className="lg:col-span-5 bg-surface-container-lowest p-md rounded-xl card-shadow">
                      <div className="flex justify-between items-center mb-md">
                        <h4 className="font-headline-md text-headline-md">Próximos Compromissos</h4>
                      </div>
                      <div className="space-y-md">
                        {events.slice(0, 3).map((ev) => (
                          <div key={ev.id} className="flex gap-md items-center group cursor-pointer p-xs rounded-lg hover:bg-surface-container-low transition-colors">
                            <div className="flex flex-col items-center bg-primary-fixed text-on-primary-fixed p-sm rounded-lg min-w-[64px]">
                              <span className="text-xs uppercase font-extrabold text-[#003ea8]">Comp</span>
                              <span className="font-atkinson text-headline-md font-bold">{ev.progress > 80 ? '85%' : '42%'}</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-body-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1">{ev.title}</h5>
                              <div className="flex items-center gap-xs text-[12px] text-outline mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="line-clamp-1">{ev.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-7 bg-surface-container-lowest p-md rounded-xl card-shadow">
                      <div className="flex justify-between items-center mb-md">
                        <h4 className="font-headline-md text-headline-md">Inscrições Pendentes</h4>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full">3 Novas</span>
                      </div>
                      <div className="divide-y divide-outline-variant/30">
                        {talents.slice(0, 3).map((tl) => (
                          <div key={tl.id} className="flex items-center justify-between py-sm first:pt-0 last:pb-0">
                            <div className="flex items-center gap-sm">
                              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image src={tl.image} fill alt={tl.name} sizes="40px" className="object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <p className="font-semibold text-body-sm">{tl.name}</p>
                                <p className="text-[12px] text-outline">{tl.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-sm">
                              <span className="px-sm py-0.5 bg-secondary-container/20 text-on-secondary-container text-xs font-semibold rounded-full">{tl.availability}</span>
                              <button 
                                onClick={() => {
                                  showToastMsg(`Voluntário ${tl.name} aprovado com sucesso!`, 'success');
                                  setMetricsHours(prev => prev + 10);
                                }}
                                className="text-primary hover:text-[#2563eb]"
                              >
                                <Check className="w-5 h-5 text-secondary font-bold" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CENTRAL DE EVENTOS */}
              {activeTab === 'eventos' && (
                <div className="space-y-lg">
                  <header className="flex flex-col md:flex-row justify-between md:items-end gap-md">
                    <div>
                      <h2 className="font-atkinson text-headline-lg font-bold text-on-surface">Central de Eventos Sociais</h2>
                      <p className="text-body-md text-on-surface-variant">Gerencie as ações planejadas, acompanhe o progresso do voluntariado e crie novos mutirões.</p>
                    </div>
                    <div>
                      <button 
                        onClick={() => setShowNewEventModal(true)}
                        className="px-md py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-body-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-xs shadow-lg shadow-primary/20"
                      >
                        <PlusCircle className="w-5 h-5" />
                        Criar Novo Evento
                      </button>
                    </div>
                  </header>

                  {/* List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {events.map((ev) => (
                      <div key={ev.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden hover:scale-[1.01] hover:shadow-xl hover:border-primary/20 transition-all flex flex-col">
                        <div className="h-44 relative bg-surface-container-high">
                          <Image src={ev.image} alt={ev.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" referrerPolicy="no-referrer" />
                          <span className={`absolute top-sm right-sm text-xs font-bold px-sm py-1 rounded-full text-on-primary ${
                            ev.category === 'Educação' ? 'bg-primary' : ev.category === 'Meio Ambiente' ? 'bg-secondary' : 'bg-tertiary-container'
                          }`}>
                            {ev.category}
                          </span>
                        </div>
                        <div className="p-md flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-atkinson text-headline-md font-semibold text-on-surface leading-tight mb-xs">{ev.title}</h4>
                              <div className="flex gap-1 shrink-0">
                                <button 
                                  onClick={() => {
                                    if (!hasEventPermission(ev.admins)) {
                                      showToastMsg('Erro: Apenas os administradores deste evento podem editá-lo.', 'error');
                                      return;
                                    }
                                    setEditingEvent(ev);
                                    setShowEditEventModal(true);
                                  }}
                                  className={`p-1 rounded-lg transition-colors ${
                                    hasEventPermission(ev.admins) 
                                      ? 'text-primary hover:bg-primary/10' 
                                      : 'text-[#737686]/40 cursor-not-allowed'
                                  }`}
                                  title={hasEventPermission(ev.admins) ? "Editar Evento" : "Apenas Administradores"}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (!hasEventPermission(ev.admins)) {
                                      showToastMsg('Erro: Apenas os administradores deste evento podem excluí-lo.', 'error');
                                      return;
                                    }
                                    handleDeleteEvent(ev.id);
                                  }}
                                  className={`p-1 rounded-lg transition-colors ${
                                    hasEventPermission(ev.admins) 
                                      ? 'text-error hover:bg-error/10' 
                                      : 'text-[#737686]/40 cursor-not-allowed'
                                  }`}
                                  title={hasEventPermission(ev.admins) ? "Excluir Evento" : "Apenas Administradores"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1.5 mb-md mt-sm">
                              <p className="text-xs text-outline flex items-center gap-xs">
                                <Clock className="w-4 h-4 text-outline" />
                                {ev.date}
                              </p>
                              <p className="text-xs text-outline flex items-center gap-xs">
                                <MapPin className="w-4 h-4 text-outline" />
                                <span className="line-clamp-1">{ev.location}</span>
                              </p>
                              <p className="text-xs text-outline flex items-center gap-xs">
                                <ShieldCheck className="w-4 h-4 text-[#137333]/75 shrink-0" />
                                <span className="line-clamp-1 text-[#137333]/90 font-medium">Admins: {ev.admins || 'admin@ong.org'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="space-y-xs pt-md border-t border-outline-variant">
                            <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                              <span>Adesão do Voluntariado</span>
                              <span className="text-secondary">{ev.progress}%</span>
                            </div>
                            <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                              <div className="bg-secondary h-full rounded-full transition-all" style={{ width: `${ev.progress}%` }}></div>
                            </div>
                            <p className="text-[12px] text-outline text-right">
                              {ev.filled} de {ev.total} vagas preenchidas
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Completed Events table index */}
                  <div className="pt-md">
                    <h3 className="font-atkinson text-headline-md text-on-surface mb-md">Histórico de Eventos Concluídos</h3>
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden card-shadow">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-surface-container border-b border-outline-variant">
                            <th className="px-md py-sm font-semibold text-[13px] text-outline">Nome do Mutirão</th>
                            <th className="px-md py-sm font-semibold text-[13px] text-outline">Data de Realização</th>
                            <th className="px-md py-sm font-semibold text-[13px] text-outline">Local</th>
                            <th className="px-md py-sm font-semibold text-[13px] text-outline">Impacto de Retorno</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                          <tr className="hover:bg-surface-container-low transition-colors">
                            <td className="px-md py-md font-semibold text-body-sm text-on-surface">Campanha de Agasalhos 2024</td>
                            <td className="px-md py-md text-body-sm text-on-surface-variant">15 de Setembro, 2024</td>
                            <td className="px-md py-md text-body-sm text-on-surface-variant">Centro Histórico</td>
                            <td className="px-md py-md text-body-sm text-secondary font-bold">120+ agasalhos doados</td>
                          </tr>
                          <tr className="hover:bg-surface-container-low transition-colors">
                            <td className="px-md py-md font-semibold text-body-sm text-on-surface">Mutirão de Limpeza Praia Limpa</td>
                            <td className="px-md py-md text-body-sm text-on-surface-variant">02 de Agosto, 2024</td>
                            <td className="px-md py-md text-body-sm text-on-surface-variant">Orla da Beira Mar</td>
                            <td className="px-md py-md text-body-sm text-secondary font-bold">500kg de lixo removido</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PORTAL DO VOLUNTÁRIO */}
              {activeTab === 'voluntarios' && (
                <div className="space-y-lg">
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                    <div className="lg:col-span-8 space-y-md">
                      <div>
                        <h2 className="font-atkinson text-headline-xl font-bold text-on-surface">Olá, Voluntário! 👋</h2>
                        <p className="text-body-lg text-on-surface-variant">Apoie as causas sociais que tocam seu coração e transforme vidas hoje.</p>
                      </div>

                      {/* Filter Capsules row */}
                      <div className="flex flex-wrap gap-xs">
                        {['Todos', 'Educação', 'Saúde', 'Meio Ambiente'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setOppFilter(cat)}
                            className={`px-sm py-2 rounded-full text-xs font-semibold transition-all ${
                              oppFilter === cat
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Opportunity highlight list */}
                      <div className="space-y-md">
                        {opportunities
                          .filter(opp => oppFilter === 'Todos' || opp.category === oppFilter)
                          .filter(opp => !searchQuery || opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || opp.description.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((opp) => (
                            <div key={opp.id} className="bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant/40 flex flex-col md:flex-row gap-gutter hover:scale-[1.005] hover:border-primary/20 transition-all">
                              <div className="w-full md:w-48 h-36 relative bg-surface-container-high rounded-lg overflow-hidden shrink-0">
                                <Image src={opp.image} alt={opp.title} fill sizes="(max-width: 768px) 100vw, 192px" className="object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start gap-xs">
                                    <h4 className="font-atkinson text-headline-md font-semibold text-on-surface leading-snug">{opp.title}</h4>
                                    <span className="px-sm py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase shrink-0">
                                      {opp.category}
                                    </span>
                                  </div>
                                  <p className="text-body-sm text-on-surface-variant mt-xs line-clamp-2">{opp.description}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-sm pt-md border-t border-outline-variant/30 mt-sm">
                                  <div className="flex gap-md text-xs text-outline font-semibold">
                                    <span className="flex items-center gap-xs"><MapPin className="w-4 h-4 text-outline" /> {opp.distance}</span>
                                    <span className="flex items-center gap-xs"><Clock className="w-4 h-4 text-outline" /> {opp.duration}</span>
                                    <span className="flex items-center gap-xs"><Check className="w-4 h-4 text-secondary" /> {opp.filled}/{opp.total} Vagas</span>
                                  </div>
                                  <button
                                    onClick={() => handleApply(opp)}
                                    className="px-md py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all text-center"
                                  >
                                    Candidatar-se
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Applications Tracker / Impact sidebar widget */}
                    <div className="lg:col-span-4 space-y-gutter">
                      <div className="bg-surface-container-lowest p-md rounded-xl card-shadow flex flex-col border border-outline-variant/40">
                        <div className="flex justify-between items-center mb-md">
                          <h3 className="font-atkinson text-headline-md font-semibold">Minhas Inscrições</h3>
                          <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded-full">
                            {myApplications.length} Ativas
                          </span>
                        </div>
                        <div className="space-y-sm max-h-48 overflow-y-auto pr-1">
                          {myApplications.map((app) => (
                            <div key={app.id} className="flex items-center gap-sm p-sm bg-surface-container-low rounded-lg hover:border-primary/20 border border-transparent transition-all">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                                app.type === 'primary' ? 'bg-primary/10 text-primary' : app.type === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary-container/10 text-tertiary'
                              }`}>
                                <Heart className="w-5 h-5 fill-current" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-body-sm line-clamp-1">{app.title}</p>
                                <p className="text-[11px] text-outline">{app.time}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-secondary" />
                                <button
                                  onClick={() => setAppToCancel(app)}
                                  className="p-1 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                  title="Cancelar inscrição"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-primary text-on-primary p-md rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                        <div className="z-10">
                          <h3 className="font-atkinson text-headline-md font-semibold mb-xs">Seu Impacto</h3>
                          <p className="text-body-sm opacity-90 mb-md">Cada hora dedicada traz mais esperança para quem precisa.</p>
                          <div className="space-y-sm border-t border-white/20 pt-sm">
                            <div className="flex justify-between text-body-sm">
                              <span>Horas doadas</span>
                              <span className="font-bold">48h</span>
                            </div>
                            <div className="flex justify-between text-body-sm">
                              <span>Pessoas apoiadas</span>
                              <span className="font-bold">120+</span>
                            </div>
                          </div>
                        </div>
                        <div className="z-10 mt-md pt-sm border-t border-white/20">
                          <p className="text-[10px] font-bold mb-1 uppercase tracking-widest text-secondary-fixed">Nível de Guardião</p>
                          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                            <div className="bg-secondary-fixed h-full rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 4: BANCO DE TALENTOS */}
              {activeTab === 'talentos' && (
                <div className="space-y-lg">
                  <header className="flex flex-col md:flex-row justify-between md:items-end gap-md">
                    <div>
                      <h2 className="font-atkinson text-headline-lg font-bold text-on-surface">Banco de Talentos</h2>
                      <p className="text-body-md text-on-surface-variant">Conecte voluntários às demandas de projetos sociais com matching inteligente por inteligência artificial.</p>
                    </div>
                    <div>
                      <button 
                        onClick={() => setShowNewTalentModal(true)}
                        className="px-md py-2.5 bg-secondary text-on-secondary rounded-xl font-semibold text-body-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-xs shadow-lg shadow-secondary/20"
                      >
                        <UserPlus className="w-5 h-5" />
                        Convidar Voluntário
                      </button>
                    </div>
                  </header>

                  {/* Filter chips bar */}
                  <div className="flex flex-wrap gap-xs">
                    {['Todos', 'Design & Arte', 'Cozinha', 'Ensino', 'T.I.'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setTalentFilter(cat)}
                        className={`px-sm py-1.5 rounded-full text-xs font-semibold transition-all ${
                          talentFilter === cat
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Directory / Matches Block */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                    {/* Database index - Expanded to full-width as requested */}
                    <div className="lg:col-span-12 bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm flex flex-col">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-surface-container border-b border-outline-variant">
                              <th className="px-md py-sm font-semibold text-[13px] text-outline">Voluntário</th>
                              <th className="px-md py-sm font-semibold text-[13px] text-outline">Habilidades</th>
                              <th className="px-md py-sm font-semibold text-[13px] text-outline">Disponibilidade</th>
                              <th className="px-md py-sm font-semibold text-[13px] text-outline text-right">Avaliação</th>
                              <th className="px-md py-sm font-semibold text-[13px] text-outline text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/20">
                            {talents
                              .filter(t => talentFilter === 'Todos' || t.skills.some(s => s.toLowerCase().includes(talentFilter.toLowerCase())))
                              .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase()))
                              .map((t) => (
                                <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                                  <td className="px-md py-sm">
                                    <div className="flex items-center gap-sm">
                                      <div className="w-11 h-10 rounded-full overflow-hidden relative border border-outline-variant shrink-0">
                                        <Image src={t.image} alt={t.name} fill sizes="40px" className="object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-body-sm leading-none">{t.name}</p>
                                        <span className="text-[11px] text-outline">{t.email}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-md py-sm">
                                    <div className="flex flex-wrap gap-xs">
                                      {t.skills.map((sk, idx) => (
                                        <span key={idx} className="px-xs py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded">
                                          {sk}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="px-md py-sm">
                                    <span className="px-2 py-0.5 bg-secondary-container/20 text-on-secondary-container font-semibold text-xs rounded-full">
                                      {t.availability}
                                    </span>
                                  </td>
                                  <td className="px-md py-sm text-right font-bold text-tertiary">
                                    ★ {t.rating === undefined ? '4.8' : t.rating}
                                  </td>
                                  <td className="px-md py-sm text-right">
                                    <div className="flex justify-end gap-1">
                                      <button 
                                        onClick={() => {
                                          setEditingTalent({ ...t, skills: t.skills.join(', ') });
                                          setShowEditTalentModal(true);
                                        }}
                                        className="p-1 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Editar Voluntário"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteTalent(t.id)}
                                        className="p-1 text-error hover:bg-error/10 rounded-lg transition-colors"
                                        title="Excluir Voluntário"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global sticky message FAB indicator */}
        <button 
          onClick={() => setShowContactModal(true)}
          className="fixed bottom-[24px] right-[24px] w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50 cursor-pointer animate-bounce"
          title="Falar com Coordenação"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* Footer info box */}
        <footer className="w-full border-t border-outline-variant bg-surface-container-low py-sm px-gutter flex justify-between items-center text-xs text-outline h-14 shrink-0">
          <span>© 2026 Agenda Solidaria - Guided Empathy System</span>
          <div className="flex gap-md font-semibold">
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Suporte</a>
          </div>
        </footer>
      </div>
    </div>
  </div>

      {/* MODAL 1: CRIAR NOVO EVENTO */}
      {showNewEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[600px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto relative font-sans text-on-surface"
          >
            <button 
              onClick={() => setShowNewEventModal(false)}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-atkinson text-xl font-bold mb-4 text-primary">Criar Novo Mutirão</h3>
            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Título do Evento</label>
                <input 
                  type="text" 
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  placeholder="Ex: Almoço Comunitário do Agasalho"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Categoria</label>
                  <select 
                    value={newEventForm.category}
                    onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-primary focus:outline-none text-sm text-[#0b1c30] bg-white h-9"
                  >
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Meio Ambiente">Meio Ambiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Vagas de Meta</label>
                  <input 
                    type="number" 
                    value={newEventForm.total}
                    onChange={(e) => setNewEventForm({ ...newEventForm, total: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-primary text-sm text-[#0b1c30] bg-white h-9"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Data e Hora</label>
                <input 
                  type="text" 
                  value={newEventForm.date}
                  onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                  placeholder="Ex: Hoje, 14:00 ou 18 Nov, 15h"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Endereço / Localização</label>
                <input 
                  type="text" 
                  value={newEventForm.location}
                  onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                  placeholder="Ex: Rua das Orquídeas, nº 85 - Centro"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Administradores Auxiliares (E-mails separados por vírgula)</label>
                <input 
                  type="text" 
                  value={newEventForm.admins}
                  onChange={(e) => setNewEventForm({ ...newEventForm, admins: e.target.value })}
                  placeholder="Ex: aux1@ong.org, aux2@ong.org"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                />
                <p className="text-[11px] text-outline mt-1 font-medium">O criador do evento ({currentUserEmail || 'admin@ong.org'}) é adicionado automaticamente como o administrador principal.</p>
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 cursor-pointer"
              >
                Concluir Criação
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 1.5: EDITAR EVENTO */}
      {showEditEventModal && editingEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[600px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto relative font-sans text-on-surface"
          >
            <button 
              onClick={() => {
                setShowEditEventModal(false);
                setEditingEvent(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-atkinson text-xl font-bold mb-4 text-primary">Editar Mutirão</h3>
            <form onSubmit={handleEditEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Título do Evento</label>
                <input 
                  type="text" 
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="Ex: Almoço Comunitário do Agasalho"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Categoria</label>
                  <select 
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-primary focus:outline-none text-sm text-[#0b1c30] bg-white h-9"
                  >
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Meio Ambiente">Meio Ambiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Vagas de Meta</label>
                  <input 
                    type="number" 
                    value={editingEvent.total}
                    onChange={(e) => setEditingEvent({ ...editingEvent, total: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-primary text-sm text-[#0b1c30] bg-white h-9"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Data e Hora</label>
                <input 
                  type="text" 
                  value={editingEvent.date || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  placeholder="Ex: Hoje, 14:00"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Endereço / Localização</label>
                <input 
                  type="text" 
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  placeholder="Ex: Rua das Orquídeas, nº 85 - Centro"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Administradores (E-mails separados por vírgula)</label>
                <input 
                  type="text" 
                  value={editingEvent.admins || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, admins: e.target.value })}
                  placeholder="Ex: admin@ong.org, aux@ong.org"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                />
                <p className="text-[11px] text-outline mt-1 font-medium">Apenas os usuários listados aqui terão permissão para modificar ou excluir este evento.</p>
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 cursor-pointer"
              >
                Salvar Alterações
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 2: INSCREVER NOVO TALENTO */}
      {showNewTalentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[600px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto relative font-sans text-on-surface"
          >
            <button 
              onClick={() => setShowNewTalentModal(false)}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-atkinson text-xl font-bold mb-4 text-secondary">Novo Cadastro de Voluntário</h3>
            <form onSubmit={handleCreateTalentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={newTalentForm.name}
                  onChange={(e) => setNewTalentForm({ ...newTalentForm, name: e.target.value })}
                  placeholder="Ex: João Roberto"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-secondary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Disponibilidade</label>
                <select 
                  value={newTalentForm.availability}
                  onChange={(e) => setNewTalentForm({ ...newTalentForm, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-secondary focus:outline-none text-sm text-[#0b1c30] bg-white h-9 text-left"
                >
                  <option value="Fins de semana">Fins de semana</option>
                  <option value="Noites (Seg-Sex)">Noites (Seg-Sex)</option>
                  <option value="Manhãs">Manhãs</option>
                  <option value="Sob-demanda">Sob-demanda</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">E-mail para Contato</label>
                <input 
                  type="email" 
                  value={newTalentForm.email}
                  onChange={(e) => setNewTalentForm({ ...newTalentForm, email: e.target.value })}
                  placeholder="Ex: joao@gmail.com"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-secondary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Habilidades (Separadas por vírgula)</label>
                <input 
                  type="text" 
                  value={newTalentForm.skills}
                  onChange={(e) => setNewTalentForm({ ...newTalentForm, skills: e.target.value })}
                  placeholder="Ex: Culinária, T.I, Design, Mecânica"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-secondary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-secondary text-on-secondary font-bold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 cursor-pointer"
              >
                Cadastrar Voluntário
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 2.5: EDITAR VOLUNTÁRIO */}
      {showEditTalentModal && editingTalent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[600px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto relative font-sans text-on-surface"
          >
            <button 
              onClick={() => {
                setShowEditTalentModal(false);
                setEditingTalent(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-atkinson text-xl font-bold mb-4 text-secondary">Editar Cadastro de Voluntário</h3>
            <form onSubmit={handleEditTalentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={editingTalent.name}
                  onChange={(e) => setEditingTalent({ ...editingTalent, name: e.target.value })}
                  placeholder="Ex: Ana Maria de Assis"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-secondary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Disponibilidade</label>
                  <select 
                    value={editingTalent.availability}
                    onChange={(e) => setEditingTalent({ ...editingTalent, availability: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-secondary text-sm text-[#0b1c30] bg-white h-9"
                  >
                    <option value="Fins de semana">Fins de semana</option>
                    <option value="Período Noturno">Período Noturno</option>
                    <option value="Horário Comercial">Horário Comercial</option>
                    <option value="Sob-demanda">Sob-demanda</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Classificação (0-5)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingTalent.rating || '4.8'}
                    onChange={(e) => setEditingTalent({ ...editingTalent, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-secondary text-sm text-[#0b1c30] bg-white h-9"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">E-mail para Contato</label>
                <input 
                  type="email" 
                  value={editingTalent.email}
                  onChange={(e) => setEditingTalent({ ...editingTalent, email: e.target.value })}
                  placeholder="Ex: joao@gmail.com"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-secondary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Habilidades (Separadas por vírgula)</label>
                <input 
                  type="text" 
                  value={editingTalent.skills}
                  onChange={(e) => setEditingTalent({ ...editingTalent, skills: e.target.value })}
                  placeholder="Ex: Culinária, T.I, Design, Mecânica"
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-secondary text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white" 
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-secondary text-on-secondary font-bold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 cursor-pointer"
              >
                Salvar Alterações
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* SUCCESS POPUP OVERLAY */}
      {showApplySuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[450px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto text-center relative font-sans text-on-surface"
          >
            <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="font-atkinson text-lg font-bold mb-2 text-[#0b1c30]">Inscrição Confirmada!</h3>
            <p className="text-body-sm text-on-surface-variant mb-5 leading-relaxed">
              Você se candidatou com sucesso ao compromisso <span className="font-bold text-primary">&ldquo;{appliedItemTitle}&rdquo;</span>. Suas horas e impacto foram atualizados instantaneamente! 🌟
            </p>
            <button 
              onClick={() => setShowApplySuccess(false)}
              className="px-6 py-2 bg-secondary text-on-secondary font-bold text-xs rounded-lg hover:opacity-95 transition-all active:scale-95 cursor-pointer shadow"
            >
              Excelente!
            </button>
          </motion.div>
        </div>
      )}

      {/* MODAL 3: CONFIGURAÇÕES */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[600px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto relative font-sans text-on-surface"
          >
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-atkinson text-xl font-bold mb-4 text-[#0b1c30] flex items-center gap-2 border-b pb-2">
              <Settings className="w-5 h-5 text-primary" />
              Configurações da Unidade
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Nome da Organização (ONG)</label>
                <input 
                  type="text" 
                  value={settingsForm.ongName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ongName: e.target.value })}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg text-sm text-[#0b1c30] bg-white focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">E-mail Administrativo</label>
                <input 
                  type="email" 
                  value={settingsForm.contactEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg text-sm text-[#0b1c30] bg-white focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Meta de Horas Mensais (Alvo de Impacto)</label>
                <input 
                  type="number" 
                  value={settingsForm.targetHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, targetHours: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg text-sm text-[#0b1c30] bg-white focus:border-primary" 
                />
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input 
                    type="checkbox" 
                    checked={settingsForm.notifyOnNewSignup}
                    onChange={(e) => setSettingsForm({ ...settingsForm, notifyOnNewSignup: e.target.checked })}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span>Notificar no Whatsapp ao receber inscrições</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input 
                    type="checkbox" 
                    checked={settingsForm.enableSoundAlerts}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableSoundAlerts: e.target.checked })}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span>Ativar alertas sonoros no feed</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface cursor-pointer rounded-lg hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    const notify = {
                      id: generateUniqueId(),
                      title: 'Configurações Salvas',
                      text: `As diretivas e metadata de "${settingsForm.ongName}" foram atualizadas com sucesso!`,
                      time: 'Agora',
                      type: 'success',
                      read: false
                    };
                    setNotifications(prev => [notify, ...prev]);
                    saveSettings(settingsForm);
                    setShowSettingsModal(false);
                  }}
                  className="px-5 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-95 cursor-pointer shadow"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 4: MANUAL / AJUDA */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[600px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto relative font-sans text-on-surface"
          >
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-atkinson text-xl font-bold mb-4 text-[#0b1c30] flex items-center gap-2 border-b pb-2">
              <HelpCircle className="w-5 h-5 text-secondary" />
              Guia do Voluntário & Coordenação
            </h3>
            <div className="space-y-4 text-xs text-on-surface-variant overflow-y-auto max-h-96 pr-1 leading-relaxed">
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30] mb-1">Como candidatar-se a um evento?</h4>
                <p>Navegue até o <strong>Portal do Voluntário</strong>, selecione a atividade desejada de acordo com as categorias e clique no botão <strong>Candidatar-se</strong>. Suas horas e impacto no painel serão atualizados instantaneamente!</p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30] mb-1">Como criar um novo mutirão?</h4>
                <p>No menu lateral esquerdo ou na aba &ldquo;Central de Eventos&rdquo;, clique no botão <strong>Novo Evento</strong>. Preencha o nome, data, local e o número máximo de voluntários desejados. Ele aparecerá imediatamente nos painéis.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30] mb-1">O que é o Banco de Talentos?</h4>
                <p>É o cadastro público de voluntários onde você pode conferir as habilidades de cada um, sua disponibilidade e email para contato, permitindo que a coordenação os selecione facilmente para tarefas pontuais.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30] mb-1">Como gerenciar as notificações?</h4>
                <p>Ao realizar ações críticas (como mudar configurações ou mandar mensagens), alertas inteligentes aparecem na barra superior do sino. Clique nele para visualizá-los e marcá-los como lidos.</p>
              </div>
              <div className="pt-2 text-center text-outline">
                <span>Versão do Sistema: v2.4 (Estável)</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowHelpModal(false)}
                className="px-6 py-2 bg-secondary text-on-secondary text-xs font-bold rounded-lg hover:opacity-95 cursor-pointer shadow"
              >
                Entendido!
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 5: PERFIL ADMIN */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[450px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto relative font-sans text-on-surface"
          >
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center pb-4 border-b">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 relative mx-auto mb-3">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYbtGmKqR1hX1AE9uz8m51NvTezcFMsrhD7SojWCNNrmqRnd3LCAI7HutKs4Ys9Mf2R7czdmq2MaH4NnFdRNJRtaVKV2Wr_2YubVlzSG-4fmqOKoIxW-6gJQBpt-hC-AD2j8uAq3rFNIi5ai9l-kscNLk9rPvag-p-Y9dNxC_dkmL-TSQSQr1ZaTzSKghm9xRDUEOtORJ6IBjYSN96p1mhyHmOhlNyXEZ557VMLXWGbQqmLg4C5BPvoadjnV6DTl24YDU2wRUs4NE"
                  alt="Admin Portrait"
                  fill
                  sizes="80px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <h3 className="font-atkinson text-lg font-bold text-[#0b1c30]">Administrador Central</h3>
              <p className="text-xs text-outline">{settingsForm.contactEmail}</p>
              <span className="mt-2 inline-block px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full">
                Coordenação Principal Geral
              </span>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-outline">Unidade de Gestão</span>
                <span className="font-bold text-[#0b1c30]">{settingsForm.ongName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-outline">Voluntários sob sua lide</span>
                <span className="font-bold text-[#0b1c30]">{activeVolunteerCount}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-outline">Status do Servidor</span>
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded">ONLINE</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-2 border-t">
              <button 
                onClick={() => {
                  setShowProfileModal(false);
                  setShowSettingsModal(true);
                }}
                className="flex-1 py-2 border border-outline-variant/60 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
              >
                Editar Perfil
              </button>
              <button 
                onClick={() => {
                  setShowProfileModal(false);
                  handleLogout();
                }}
                className="flex-1 py-2 border border-error/30 text-xs font-bold text-error hover:bg-error/5 rounded-lg cursor-pointer transition-colors"
              >
                Sair
              </button>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-95 cursor-pointer shadow"
              >
                Voltar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 6: CONTATO COORDENAÇÃO */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[600px] max-w-full shrink-0 max-h-[90vh] overflow-y-auto relative font-sans text-on-surface"
          >
            <button 
              onClick={() => {
                setShowContactModal(false);
                setContactMessage('');
              }}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-atkinson text-xl font-bold mb-3 text-[#0b1c30] flex items-center gap-2 border-b pb-2">
              <MessageSquare className="w-5 h-5 text-secondary" />
              Enviar Sugestão / Mensagem
            </h3>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Escreva diretamente para a mesa de coordenação do <strong>{settingsForm.ongName}</strong>. Suas ideias e relatórios são valiosos para nós!
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Sua Mensagem</label>
                <textarea 
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Escreva sua sugestão de melhoria, aviso de suporte ou feedback..."
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-sm text-[#0b1c30] placeholder-[#737686]/60 bg-white focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setShowContactModal(false);
                    setContactMessage('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface cursor-pointer rounded-lg hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    if (!contactMessage.trim()) return;
                    const messageNotify = {
                      id: generateUniqueId(),
                      title: 'Mensagem Enviada',
                      text: `Sugestão transmitida com sucesso para central: "${contactMessage.length > 50 ? contactMessage.slice(0, 50) + '...' : contactMessage}"`,
                      time: 'Agora',
                      type: 'success',
                      read: false
                    };
                    setNotifications(prev => [messageNotify, ...prev]);
                    setContactMessage('');
                    setShowContactModal(false);
                    setShowNotificationDropdown(true);
                  }}
                  disabled={!contactMessage.trim()}
                  className="px-5 py-2 bg-secondary text-on-secondary text-xs font-bold rounded-lg hover:opacity-95 disabled:opacity-50 cursor-pointer shadow"
                >
                  Enviar Mensagem
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-xs border font-sans text-xs font-semibold ${
            toast.type === 'success' 
              ? 'bg-[#e6f4ea] text-[#137333] border-[#137333]/20' 
              : toast.type === 'error' 
              ? 'bg-[#fce8e6] text-[#c5221f] border-[#c5221f]/20' 
              : 'bg-[#e8f0fe] text-[#1a73e8] border-[#1a73e8]/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#137333]" />
            ) : toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-[#c5221f]" />
            ) : (
              <Info className="w-4 h-4 text-[#1a73e8]" />
            )}
            <span>{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="ml-4 h-5 w-5 hover:bg-black/5 rounded flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* DELETE EVENT CONFIRMATION MODAL */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[450px] max-w-full text-center font-sans text-on-surface"
          >
            <Trash2 className="w-16 h-16 text-error mx-auto mb-4" />
            <h3 className="font-atkinson text-lg font-bold mb-2 text-[#0b1c30]">Excluir Mutirão?</h3>
            <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">
              Tem certeza que deseja excluir o mutirão <span className="font-semibold text-primary">&ldquo;{eventToDelete.title}&rdquo;</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setEventToDelete(null)}
                className="px-5 py-2 text-xs font-bold text-outline hover:text-on-surface cursor-pointer rounded-lg hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteEvent}
                className="px-6 py-2 bg-error text-on-error font-bold text-xs rounded-lg hover:opacity-95 transition-all active:scale-95 cursor-pointer shadow-md"
              >
                Sim, Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* DELETE TALENT CONFIRMATION MODAL */}
      {talentToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[450px] max-w-full text-center font-sans text-on-surface"
          >
            <Trash2 className="w-16 h-16 text-error mx-auto mb-4" />
            <h3 className="font-atkinson text-lg font-bold mb-2 text-[#0b1c30]">Excluir Voluntário?</h3>
            <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">
              Tem certeza que deseja excluir o cadastro do voluntário <span className="font-semibold text-primary">&ldquo;{talentToDelete.name}&rdquo;</span>?
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setTalentToDelete(null)}
                className="px-5 py-2 text-xs font-bold text-outline hover:text-on-surface cursor-pointer rounded-lg hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteTalent}
                className="px-6 py-2 bg-error text-on-error font-bold text-xs rounded-lg hover:opacity-95 transition-all active:scale-95 cursor-pointer shadow-md"
              >
                Sim, Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* CANCEL APPLICATION CONFIRMATION MODAL */}
      {appToCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[450px] max-w-full text-center font-sans text-on-surface"
          >
            <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
            <h3 className="font-atkinson text-lg font-bold mb-2 text-[#0b1c30]">Cancelar Inscrição?</h3>
            <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">
              Deseja realmente cancelar sua inscrição em <span className="font-semibold text-primary">&ldquo;{appToCancel.title}&rdquo;</span>?
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setAppToCancel(null)}
                className="px-5 py-2 text-xs font-bold text-outline hover:text-on-surface cursor-pointer rounded-lg hover:bg-surface-container"
              >
                Manter Inscrição
              </button>
              <button 
                onClick={confirmCancelApplication}
                className="px-6 py-2 bg-error text-on-error font-bold text-xs rounded-lg hover:opacity-95 transition-all active:scale-95 cursor-pointer shadow-md"
              >
                Sim, Cancelar Inscrição
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* SUPABASE STATUS AND SQL MIGRATION MODAL */}
      {showSupabaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-outline-variant/30 w-[95vw] md:w-[700px] max-w-full max-h-[90vh] overflow-y-auto font-sans text-on-surface relative"
          >
            <button 
              onClick={() => setShowSupabaseModal(false)}
              className="absolute top-4 right-4 p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 border-b pb-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-atkinson text-xl font-bold text-[#0b1c30]">Integração do Supabase</h3>
                <p className="text-xs text-outline font-medium">Configure e sincronize o banco de dados em tempo real</p>
              </div>
            </div>

            {/* Status Breakdown Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-surface-container/40 border border-outline-variant/20 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-outline mb-1">Status da Conexão</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    supabaseStatus?.success && !supabaseStatus?.needsMigration
                      ? 'bg-emerald-500'
                      : supabaseStatus?.success && supabaseStatus?.needsMigration
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`} />
                  <span className="text-sm font-bold text-[#0b1c30]">
                    {supabaseStatus?.success && !supabaseStatus?.needsMigration ? (
                      'Conectado e Operando'
                    ) : supabaseStatus?.success && supabaseStatus?.needsMigration ? (
                      'Conectado (Sem Tabelas)'
                    ) : (
                      'Desconectado'
                    )}
                  </span>
                </div>
                {supabaseStatus?.reason && (
                  <p className="text-xs text-rose-600 font-medium mt-1.5 leading-tight">{supabaseStatus.reason}</p>
                )}
              </div>

              <div className="p-4 bg-surface-container/40 border border-outline-variant/20 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-outline mb-1">Fonte Ativa de Dados</p>
                <div className="text-xs font-semibold text-[#0b1c30] space-y-1">
                  <div className="flex justify-between">
                    <span>Oportunidades:</span>
                    <span className={supabaseSourceInfo.opportunities === 'supabase' ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                      {supabaseSourceInfo.opportunities === 'supabase' ? 'Supabase' : 'Fallback Local'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mutirões/Eventos:</span>
                    <span className={supabaseSourceInfo.events === 'supabase' ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                      {supabaseSourceInfo.events === 'supabase' ? 'Supabase' : 'Fallback Local'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Talentos/Vagas:</span>
                    <span className={supabaseSourceInfo.talents === 'supabase' ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                      {supabaseSourceInfo.talents === 'supabase' ? 'Supabase' : 'Fallback Local'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Migration Required Block */}
            {supabaseStatus?.needsMigration && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800">Criação de Tabelas Requerida!</h4>
                  <p className="text-xs text-amber-700 leading-normal mt-1">
                    A chave de conexão ao Supabase foi validada com sucesso, mas as tabelas ainda não foram criadas. Siga as instruções abaixo para ativar a sincronização em tempo real.
                  </p>
                </div>
              </div>
            )}

            {/* SQL Copy Instructions */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-[#0b1c30] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Como configurar no Supabase:
              </h4>
              <ol className="text-xs text-on-surface-variant list-decimal list-inside space-y-1.5 leading-relaxed pl-1">
                <li>Acesse o dashboard do seu projeto no <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">Supabase</a></li>
                <li>No menu esquerdo, vá em <strong>SQL Editor</strong> e clique em <strong>New Query</strong></li>
                <li>Copie o script SQL abaixo e cole-o na área de texto</li>
                <li>Clique em <strong>Run</strong> para criar as tabelas e habilitar acesso público</li>
                <li>Recarregue este aplicativo para começar a persistir em tempo real!</li>
              </ol>
            </div>

            {/* SQL Script Block */}
            <div className="mb-6">
              <div className="flex items-center justify-between bg-surface-container px-4 py-2 rounded-t-lg border border-outline-variant/30 border-b-0">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">Script SQL de Migração</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SQL_MIGRATION_SCRIPT);
                    showToastMsg('Script SQL copiado com sucesso!', 'success');
                  }}
                  className="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  Copiar SQL
                </button>
              </div>
              <pre className="p-4 bg-[#1e1e1e] text-[#d4d4d4] text-[11px] rounded-b-lg border border-[#1e1e1e] font-mono h-[200px] overflow-auto leading-relaxed">
                {SQL_MIGRATION_SCRIPT}
              </pre>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  loadAndSyncSupabase();
                  showToastMsg('Sincronização reiniciada!', 'info');
                }}
                className="px-4 py-2 text-xs font-bold border border-outline-variant rounded-lg hover:bg-surface-container transition-all cursor-pointer"
                disabled={isLoadingSupabase}
              >
                {isLoadingSupabase ? 'Testando...' : 'Re-testar Conexão'}
              </button>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="px-5 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-95 transition-all cursor-pointer shadow"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
