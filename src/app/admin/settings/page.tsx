'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadFileToFtp } from '@/lib/uploadClient';
import {
  getNavItems,
  saveNavItemsAction,
  getPagesList,
  getFooterData,
  saveFooterSettingsAction,
  getSiteIdentity,
  saveSiteIdentityAction,
  getShareTools,
  saveShareToolsAction,
  getGlobalCss,
  saveGlobalCssAction,
  getLoginAuthSettings,
  saveLoginAuthSettingsAction,
  getDisclaimerSettings,
  saveDisclaimerSettingsAction,
  getFormsSettings,
  saveFormsSettingsAction,
} from '@/actions/pageActions';
import { getResponsiveEmailTemplateHtml } from '@/lib/emailTemplate';
import {
  getUsersList,
  createUserAction,
  updateUserAction,
  deleteUserAction,
} from '@/actions/userActions';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import ConfirmModal, { ConfirmModalConfig } from '@/components/ui/ConfirmModal';
import GlassNotificationModal from '@/components/ui/GlassNotificationModal';
import { Trash2, Upload, MoveUp, MoveDown, Check, Save, CloudUpload, Plus, Edit2, Key, Eye, EyeOff, X, Pencil } from 'lucide-react';

const TABS = [
  { id: 'header-footer', label: 'Header & Footer', icon: '🎨' },
  { id: 'seo', label: 'SEO Intelligence', icon: '🔍' },
  { id: 'identity', label: 'Site Identity', icon: '🏢' },
  { id: 'share', label: 'Share Tools', icon: '🔗' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'auth', label: 'Login Auth', icon: '🔐' },
  { id: 'popup', label: 'Disclaimer Popup', icon: '🚨' },
  { id: 'css', label: 'Global CSS', icon: '💻' },
  { id: 'forms', label: 'Forms', icon: '📝' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('header-footer');
  const [subTab, setSubTab] = useState<'header' | 'footer'>('header');

  // 3D Glassmorphism Notification State
  const [notificationConfig, setNotificationConfig] = useState<{
    isOpen: boolean;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setNotificationConfig({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  // Form states
  const [siteName, setSiteName] = useState('King Travel Canada');
  const [altText, setAltText] = useState('Official King Travel Canada Logo');
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [customCss, setCustomCss] = useState('/* Add custom CSS rules here */');

  // Navigation Builder State
  const [navTree, setNavTree] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagesList, setPagesList] = useState<any[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Footer Builder State
  const [footerData, setFooterData] = useState<any>({});
  const [footerSaveMsg, setFooterSaveMsg] = useState<string | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmModalConfig | null>(null);

  // Site Identity State
  const [identityData, setIdentityData] = useState<any>({
    siteName: 'King Travel Canada',
    tagline: '',
    logo: '/img/logo.png',
    logoAlt: 'King Travel Canada Logo',
    favicon: '/img/favicon.ico',
    faviconAlt: 'King Travel Favicon',
  });
  const [identitySaveMsg, setIdentitySaveMsg] = useState<string | null>(null);

  // Share Tools State
  const [shareData, setShareData] = useState<any>({
    enabled: true,
    iconStyle: 'rounded-square',
    iconSize: 40,
    colorScheme: 'brand-colors',
    gapFromEdge: 20,
    verticalPosition: 'center',
    sidebarEdge: 'right',
    showLabels: true,
    hideOnScrollDown: false,
    openBehavior: 'popup',
    delayBeforeShowing: 0,
    excludePages: '/cart, /checkout, /private',
    urlToShare: 'current',
    customShareUrl: '',
    utmParameters: false,
    trackClicks: true,
    gaEventName: 'share_click',
    activePlatforms: [
      { id: 'facebook', name: 'Facebook', enabled: true, color: '#1877F2' },
      { id: 'whatsapp', name: 'WhatsApp', enabled: true, color: '#25D366' },
      { id: 'x', name: 'X (Twitter)', enabled: true, color: '#000000' },
      { id: 'email', name: 'Email', enabled: true, color: '#EA4335' },
      { id: 'linkedin', name: 'LinkedIn', enabled: true, color: '#0A66C2' },
      { id: 'pinterest', name: 'Pinterest', enabled: true, color: '#E60023' },
      { id: 'telegram', name: 'Telegram', enabled: true, color: '#24A1DE' },
    ],
  });
  const [shareSaveMsg, setShareSaveMsg] = useState<string | null>(null);
  const [savingShare, setSavingShare] = useState(false);
  const [cssSaveMsg, setCssSaveMsg] = useState<string | null>(null);

  // Users state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<'create' | 'edit'>('create');
  const [userFormData, setUserFormData] = useState<any>({
    id: 0,
    name: '',
    email: '',
    password: '',
    role: 'admin',
    active: true,
    badgeBg: '#0F766E',
    badgeTextColor: '#FFFFFF',
  });
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [userSaveMsg, setUserSaveMsg] = useState<string | null>(null);

  // Login Auth state
  const [loginAuthData, setLoginAuthData] = useState<any>({
    backgroundImage: '',
    backgroundAlt: '',
    footerText: '© 2026 King Travel Can Ltd. All Rights Reserved.',
    maintenanceMode: false,
  });
  const [loginSaveMsg, setLoginSaveMsg] = useState<string | null>(null);
  const [savingLogin, setSavingLogin] = useState(false);

  // Disclaimer Popup state
  const [disclaimerData, setDisclaimerData] = useState<any>({
    enabled: false,
    image: '',
    altText: 'Disclaimer Popup Image',
  });
  const [disclaimerSaveMsg, setDisclaimerSaveMsg] = useState<string | null>(null);
  const [savingDisclaimer, setSavingDisclaimer] = useState(false);

  // Forms Manager state
  const [formsSubTab, setFormsSubTab] = useState<
    'all' | 'emailConfigs' | 'emailTemplate' | 'inbox' | 'sentHistory' | 'emailLogs'
  >('all');
  const [editingFormKey, setEditingFormKey] = useState<string | null>(null);

  const [formFieldsState, setFormFieldsState] = useState<Record<string, Array<{ id: string; label: string; type: string; placeholder: string; required: boolean }>>>({
    contact: [
      { id: '1', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { id: '2', label: 'Email Address', type: 'email', placeholder: 'name@example.com', required: true },
      { id: '3', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', required: true },
      { id: '4', label: 'Subject', type: 'text', placeholder: 'Inquiry subject', required: false },
      { id: '5', label: 'Message', type: 'textarea', placeholder: 'Write your message here...', required: true },
    ],
    packageInquiry: [
      { id: '1', label: 'Pilgrim Name', type: 'text', placeholder: 'Lead pilgrim full name', required: true },
      { id: '2', label: 'Contact Phone', type: 'tel', placeholder: '+1 (555) 000-0000', required: true },
      { id: '3', label: 'Email Address', type: 'email', placeholder: 'name@example.com', required: true },
      { id: '4', label: 'Select Package', type: 'select', placeholder: 'Select package choice', required: true },
      { id: '5', label: 'Number of Travelers', type: 'text', placeholder: 'e.g. 4 adults', required: true },
      { id: '6', label: 'Special Notes', type: 'textarea', placeholder: 'Any special requests...', required: false },
    ],
    visaConsultation: [
      { id: '1', label: 'Applicant Name', type: 'text', placeholder: 'Full passport name', required: true },
      { id: '2', label: 'Nationality', type: 'text', placeholder: 'e.g. Canadian', required: true },
      { id: '3', label: 'Passport Type', type: 'select', placeholder: 'Regular / Diplomatic', required: true },
      { id: '4', label: 'Destination', type: 'text', placeholder: 'Saudi Arabia', required: true },
      { id: '5', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', required: true },
      { id: '6', label: 'Consultation Details', type: 'textarea', placeholder: 'Describe your visa needs...', required: false },
    ],
    quoteForm: [
      { id: '1', label: 'Your Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { id: '2', label: 'Phone Number', type: 'tel', placeholder: '+1 905 624 8344', required: true },
      { id: '3', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true },
      { id: '4', label: 'Select Your Package', type: 'select', placeholder: 'Select your package choice', required: true },
      { id: '5', label: 'Departure Date', type: 'date', placeholder: 'mm/dd/yyyy', required: true },
      { id: '6', label: 'Number of Adults', type: 'number', placeholder: '1', required: true },
    ],
    packageDetailForm: [
      { id: '1', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { id: '2', label: 'Phone Number', type: 'tel', placeholder: '+1 905 624 8344', required: true },
      { id: '3', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true },
      { id: '4', label: 'Adults', type: 'select', placeholder: '1', required: true },
      { id: '5', label: 'Children', type: 'select', placeholder: '0', required: true },
      { id: '6', label: 'Infants', type: 'select', placeholder: '0', required: true },
      { id: '7', label: 'Select Start Date', type: 'date', placeholder: 'mm/dd/yyyy', required: true },
    ],
    flightInquiry: [
      { id: '1', label: 'Passenger Name', type: 'text', placeholder: 'Full name', required: true },
      { id: '2', label: 'Departure City', type: 'text', placeholder: 'e.g. Toronto (YYZ)', required: true },
      { id: '3', label: 'Destination City', type: 'text', placeholder: 'Jeddah (JED) / Madinah (MED)', required: true },
      { id: '4', label: 'Travel Dates', type: 'text', placeholder: 'Departure & Return dates', required: true },
      { id: '5', label: 'Number of Passengers', type: 'text', placeholder: 'e.g. 2 Adults, 1 Child', required: true },
      { id: '6', label: 'Contact Phone', type: 'tel', placeholder: '+1 (555) 000-0000', required: true },
    ],
  });

  const [emailConfigs, setEmailConfigs] = useState({
    sendToEmail: 'info@kingtravelcan.com',
    emailSubjectLine: 'New Pilgrimage Form Submission',
    fromName: 'King Travel Canada',
    fromEmail: 'no-reply@kingtravelcan.com',
    replyTo: 'no-reply@kingtravelcan.com',
    successHeading: 'Message Sent Successfully!',
    successDescription: 'Thank you for contacting King Travel Canada. We will respond within 24 hours.',
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
  });

  const [emailTemplateHtml, setEmailTemplateHtml] = useState<string>(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Inquiry Notification</title></head>
<body style="font-family: sans-serif; background: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
    <h2 style="color: #004B39; margin-top: 0;">King Travel Canada</h2>
    <h3 style="color: #0f172a;">New Form Submission Received</h3>
    <table width="100%" style="border-collapse: collapse; font-size: 13px;">
      <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Full Name:</td><td>[name]</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Email Address:</td><td>[email]</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Phone Number:</td><td>[phone]</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td>[subject]</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td>[msg]</td></tr>
    </table>
    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
    <p style="font-size: 11px; color: #94a3b8; text-align: center;">© 2026 King Travel Canada Ltd. All Rights Reserved.</p>
  </div>
</body>
</html>`);

  const [formsData, setFormsData] = useState<any>({
    quoteForm: { title: 'Get a Free Quote Form', subtitle: 'Homepage & landing page Get a Free Quote banner form.', recipientEmail: 'info@kingtravelcan.com', successMessage: 'Thank you! Your quote request has been received.', enabled: true, buttonText: 'Submit Quote' },
    packageDetailForm: { title: 'Package Detail Page Booking Form', subtitle: 'Dedicated package detail page booking & reservation form.', recipientEmail: 'booking@kingtravelcan.com', successMessage: 'Your package booking request has been submitted.', enabled: true, buttonText: 'Book Package' },
    contact: { title: 'Get In Touch With Us', subtitle: 'Have questions about Umrah, Hajj or Saudi Visa?', recipientEmail: 'info@kingtravelcan.com', successMessage: 'Thank you! Your message has been received.', enabled: true, buttonText: 'Send Message' },
    packageInquiry: { title: 'Inquire About Pilgrimage Packages', subtitle: 'Fill in your details below and our team will craft a customized package for you.', recipientEmail: 'booking@kingtravelcan.com', successMessage: 'Package inquiry submitted successfully!', enabled: true, buttonText: 'Submit Package Inquiry' },
    visaConsultation: { title: 'Apply For Saudi Visa Consultation', subtitle: 'Fast, authorized & reliable Saudi eVisa and Pilgrimage visa processing.', recipientEmail: 'visas@kingtravelcan.com', successMessage: 'Visa application submitted!', enabled: true, buttonText: 'Submit Visa Request' },
    flightInquiry: { title: 'Request Flight Booking Assistance', subtitle: 'Get the best rates on direct and connecting flights to Jeddah & Madinah.', recipientEmail: 'flights@kingtravelcan.com', successMessage: 'Flight request received!', enabled: true, buttonText: 'Request Flight Quote' },
  });
  const [formsSaveMsg, setFormsSaveMsg] = useState<string | null>(null);
  const [savingForms, setSavingForms] = useState(false);

  useEffect(() => {
    getNavItems().then(items => {
      if (items && Array.isArray(items)) setNavTree(items);
    });
    getPagesList().then(pages => {
      if (pages && Array.isArray(pages)) setPagesList(pages);
    });
    getFooterData().then(data => {
      if (data) setFooterData(data);
    });
    getSiteIdentity().then(data => {
      if (data) setIdentityData(data);
    });
    getShareTools().then(data => {
      if (data) {
        let finalData = { ...data };
        if (typeof window !== 'undefined') {
          const localShare = localStorage.getItem('king_travel_share_tools');
          if (localShare) {
            try {
              const parsedLocal = JSON.parse(localShare);
              if (parsedLocal && parsedLocal.enabled !== undefined) {
                finalData.enabled = parsedLocal.enabled;
              }
            } catch (e) {}
          }
        }
        setShareData(finalData);
      }
    });
    if (typeof window !== 'undefined') {
      const localShare = localStorage.getItem('king_travel_share_tools');
      if (localShare) {
        try {
          setShareData(JSON.parse(localShare));
        } catch (e) {}
      }
    }
    getGlobalCss().then(css => {
      if (css) setCustomCss(css);
    });
    getUsersList().then(list => {
      if (list && Array.isArray(list)) setUsersList(list);
    });
    getLoginAuthSettings().then(data => {
      if (data) setLoginAuthData(data);
    });
    getDisclaimerSettings().then(data => {
      if (data) setDisclaimerData(data);
    });
    getFormsSettings().then(data => {
      if (data) {
        const loadedData = data.formsData || data;
        setFormsData((prev: any) => ({
          ...prev,
          ...loadedData,
        }));
        if (data.formFieldsState) setFormFieldsState(data.formFieldsState);
        if (data.emailConfigs) setEmailConfigs(data.emailConfigs);
        if (data.emailTemplateHtml) setEmailTemplateHtml(data.emailTemplateHtml);
      }
    });
  }, []);

  const handleSaveFormsSettings = async () => {
    setSavingForms(true);
    setFormsSaveMsg(null);
    const fullPayload = {
      formsData,
      formFieldsState,
      emailConfigs,
      emailTemplateHtml,
    };
    const res = await saveFormsSettingsAction(fullPayload);
    setSavingForms(false);
    if (res.success) {
      if ((res as any).warning) {
        showNotification('Configurations Saved', 'Form & Email configurations saved to session cache! ' + (res as any).warning, 'warning');
      } else {
        showNotification('Configurations Published!', 'Form routing, email addresses, and form input fields updated & published live!', 'success');
      }
    } else {
      showNotification('Save Failed', (res as any).error || 'Failed to save forms configuration.', 'error');
    }
  };

  const handleInitiateRemoveForm = (formKey: string, formTitle: string) => {
    setConfirmConfig({
      title: `Remove ${formTitle}?`,
      message: `Are you sure you want to completely remove "${formTitle}"? This will permanently delete this form configuration from the database.`,
      icon: '🗑️',
      confirmText: 'Yes, Delete Form',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: () => handleRemoveFormCompletely(formKey),
    });
  };

  const handleRemoveFormCompletely = async (formKey: string) => {
    const updatedFormsData = { ...formsData };
    delete updatedFormsData[formKey];

    const updatedFormFieldsState = { ...formFieldsState };
    delete updatedFormFieldsState[formKey];

    setFormsData(updatedFormsData);
    setFormFieldsState(updatedFormFieldsState);

    if (editingFormKey === formKey) {
      setEditingFormKey(null);
    }

    setSavingForms(true);
    const fullPayload = {
      formsData: updatedFormsData,
      formFieldsState: updatedFormFieldsState,
      emailConfigs,
      emailTemplateHtml,
    };
    const res = await saveFormsSettingsAction(fullPayload);
    setSavingForms(false);

    if (res.success) {
      showNotification('Form Deleted', 'Form completely removed from database!', 'success');
    } else {
      showNotification('Remove Failed', (res as any).error || 'Failed to remove form from database.', 'error');
    }
  };

  const handleOpenAddUser = () => {
    setUserFormData({
      id: 0,
      name: '',
      email: '',
      password: '',
      role: 'admin',
      active: true,
      badgeBg: '#0F766E',
      badgeTextColor: '#FFFFFF',
    });
    setUserModalMode('create');
    setShowModalPassword(false);
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (user: any) => {
    setUserFormData({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'admin',
      active: user.active ?? true,
      badgeBg: user.badgeBg || '#0F766E',
      badgeTextColor: user.badgeTextColor || '#FFFFFF',
    });
    setUserModalMode('edit');
    setShowModalPassword(false);
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.email) {
      showNotification('Validation Error', 'Name and Email are required fields.', 'warning');
      return;
    }

    if (userModalMode === 'create') {
      const res = await createUserAction(userFormData);
      if (res.success) {
        setUserModalOpen(false);
        const updated = await getUsersList();
        setUsersList(updated);
        showNotification('User Created', 'New administrator user created successfully!', 'success');
      } else {
        showNotification('Creation Failed', res.error || 'Failed to create user.', 'error');
      }
    } else {
      const res = await updateUserAction(userFormData.id, userFormData);
      if (res.success) {
        setUserModalOpen(false);
        const updated = await getUsersList();
        setUsersList(updated);
        showNotification('User Updated', 'Administrator user details updated successfully!', 'success');
      } else {
        showNotification('Update Failed', res.error || 'Failed to update user.', 'error');
      }
    }
  };

  const handleDeleteUser = (id: number, name: string) => {
    setConfirmConfig({
      icon: <Trash2 className="w-3 h-3 text-red-600" />,
      title: 'Delete User Account',
      message: `Are you sure you want to delete user "${name}"? This action cannot be undone.`,
      confirmText: 'Delete User',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteUserAction(id);
        if (res.success) {
          const updated = await getUsersList();
          setUsersList(updated);
          setUserSaveMsg('✅ User Deleted!');
          setTimeout(() => setUserSaveMsg(null), 3000);
        }
      },
    });
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUserFormData((prev: any) => ({ ...prev, password: pwd }));
    setShowModalPassword(true);
  };

  const handleSaveLoginAuth = async () => {
    setSavingLogin(true);
    const res = await saveLoginAuthSettingsAction(loginAuthData);
    setSavingLogin(false);
    if (res.success) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('maintenance_updated', { detail: { maintenanceMode: loginAuthData.maintenanceMode } }));
      }
      setLoginSaveMsg('✅ Login Auth Settings Saved!');
      setTimeout(() => setLoginSaveMsg(null), 3000);
    }
  };

  const handleSaveDisclaimer = async () => {
    setSavingDisclaimer(true);
    const res = await saveDisclaimerSettingsAction(disclaimerData);
    setSavingDisclaimer(false);
    if (res.success) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('disclaimer_updated', { detail: disclaimerData }));
      }
      setDisclaimerSaveMsg('✅ Disclaimer Popup Settings Saved!');
      setTimeout(() => setDisclaimerSaveMsg(null), 3000);
    }
  };

  const handleSaveNav = async (updatedTree: any[]) => {
    setNavTree(updatedTree);
    const res = await saveNavItemsAction(updatedTree);
    if (res.success) {
      setSaveMsg('✅ Navigation Menu Updated!');
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  const handleSaveFooter = () => {
    setConfirmConfig({
      icon: '💾',
      title: 'Save Footer Settings',
      message: 'Would you like to publish and apply these updated Footer links, logos, and switches to the live website?',
      confirmText: 'Save & Publish',
      cancelText: 'Cancel',
      variant: 'primary',
      onConfirm: async () => {
        const res = await saveFooterSettingsAction(footerData);
        if (res.success) {
          setFooterSaveMsg('✅ Footer Settings Saved & Published!');
          setTimeout(() => setFooterSaveMsg(null), 4000);
        }
      },
    });
  };

  const handleSaveIdentity = () => {
    const updatedIdentity = {
      ...identityData,
      siteName: siteName || identityData.siteName,
      logoAlt: altText || identityData.logoAlt,
    };
    setConfirmConfig({
      icon: '🏷️',
      title: 'Save Site Identity',
      message: 'Would you like to publish these updated branding assets, logo, site name, and tagline to the live website?',
      confirmText: 'Save & Publish',
      cancelText: 'Cancel',
      variant: 'primary',
      onConfirm: async () => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('king_travel_site_identity', JSON.stringify(updatedIdentity));
          window.dispatchEvent(new Event('identity_updated'));
        }
        const res = await saveSiteIdentityAction(updatedIdentity);
        if (res.success) {
          if (res.warning) {
            showNotification('Site Identity Saved', 'Branding settings saved to session cache! ' + res.warning, 'warning');
          } else {
            showNotification('Site Identity Published!', 'Site identity & branding updated successfully!', 'success');
          }
        }
      },
    });
  };

  const handleSaveHeaderAll = async () => {
    const updatedIdentity = {
      ...identityData,
      siteName: siteName || identityData.siteName,
      logoAlt: altText || identityData.logoAlt,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('king_travel_site_identity', JSON.stringify(updatedIdentity));
      window.dispatchEvent(new Event('identity_updated'));
    }
    const res = await saveSiteIdentityAction(updatedIdentity);
    await handleSaveNav(navTree);
    if (res.success) {
      if (res.warning) {
        showNotification('Header Settings Saved', 'Header settings & navigation saved to session cache! ' + res.warning, 'warning');
      } else {
        showNotification('Header Settings Published!', 'Header navigation, logo, and site identity published live successfully!', 'success');
      }
    }
  };

  const handleSaveShareTools = async () => {
    setSavingShare(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('king_travel_share_tools', JSON.stringify(shareData));
    }
    const res = await saveShareToolsAction(shareData);
    setSavingShare(false);
    if (res.success) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('share_tools_updated'));
      }
      setShareSaveMsg('✅ Share Tools Configuration Saved!');
      setTimeout(() => setShareSaveMsg(null), 3000);
    }
  };

  const handleSaveCss = () => {
    setConfirmConfig({
      icon: '💻',
      title: 'Save Custom CSS Overrides',
      message: 'Would you like to apply these custom CSS overrides live to your entire website?',
      confirmText: 'Save & Apply',
      cancelText: 'Cancel',
      variant: 'primary',
      onConfirm: async () => {
        const res = await saveGlobalCssAction(customCss);
        if (res.success) {
          setCssSaveMsg('✅ Custom CSS Overrides Saved & Applied!');
          setTimeout(() => setCssSaveMsg(null), 4000);
        }
      },
    });
  };

  return (
    <AdminLayout user={{ name: 'Admin User', role: 'Super Admin' }}>
      <div className="flex flex-col gap-6 font-sans text-slate-800">

        {/* ── Page Header ── */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h1 className="text-2xl font-extrabold text-slate-900 m-0">Settings</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 mb-0">
            Manage global interface settings, brand identity, navigation builders, and system options.
          </p>
        </div>

        {/* ── Top Multi-Tab Bar ── */}
        <div className="flex gap-2 flex-wrap bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${activeTab === t.id
                ? 'bg-[#004B39] text-white border-[#004B39]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Header & Footer Sub-Tabs ── */}
        {activeTab === 'header-footer' && (
          <div className="flex justify-between items-center">
            <div className="flex gap-2.5">
              <button
                onClick={() => setSubTab('header')}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${subTab === 'header' ? 'border-[#004B39] bg-[#e6f4f1] text-[#004B39]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
              >
                📋 Header Builder
              </button>
              <button
                onClick={() => setSubTab('footer')}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${subTab === 'footer' ? 'border-[#004B39] bg-[#e6f4f1] text-[#004B39]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
              >
                👣 Footer Builder
              </button>
            </div>
            {subTab === 'header' && (
              <button
                type="button"
                onClick={handleSaveHeaderAll}
                className="bg-[#004B39] text-white hover:bg-[#00382B] px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Save className="w-4 h-4 text-emerald-300" /> Save Header Settings
              </button>
            )}
          </div>
        )}

        {/* ── Main Tab Content Box ── */}
        <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-xs flex flex-col gap-7">

          {/* ================= TAB 1: HEADER & FOOTER ================= */}
          {activeTab === 'header-footer' && subTab === 'header' && (
            <div className="flex flex-col gap-6">
              {/* Logo & Identity Panel */}
              <div className="border-b border-slate-100 pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider m-0">
                    🖼 LOGO &amp; IDENTITY
                  </h3>
                  <button
                    type="button"
                    onClick={handleSaveIdentity}
                    className="bg-[#004B39] text-white hover:bg-[#00382B] px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border-none"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-300" /> Save Logo &amp; Identity
                  </button>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-6 items-center">
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center">
                    <img src="/img/logo.png" alt="Logo Preview" className="max-w-full h-auto block mx-auto" />
                    <span className="text-[10px] text-slate-400 mt-2 block">PNG, SVG or WEBP</span>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-500 mb-1.5">
                        SITE NAME (TEXT FALLBACK)
                      </label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs outline-none focus:border-[#004B39]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-500 mb-1.5">
                        ALTERNATIVE TEXT
                      </label>
                      <input
                        type="text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs outline-none focus:border-[#004B39]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Menu Builder (Multi-level & Colorized) */}
              <div className="border-b border-slate-100 pb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider m-0">
                      NAVIGATION MENU BUILDER
                    </h3>
                    {saveMsg && <span className="text-xs font-bold text-emerald-600">{saveMsg}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem({ id: String(Date.now()), label: '', url: '', level: 1, parentId: null, children: [] });
                      setIsModalOpen(true);
                    }}
                    className="bg-[#004B39] text-white hover:bg-[#00382B] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border-none shadow-sm flex items-center gap-1"
                  >
                    + Add Item
                  </button>
                </div>

                {/* Render Multi-level Colorized Menu Tree */}
                <div className="flex flex-col gap-2">
                  {navTree.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1.5">
                      {/* Level 1: White/Emerald Card */}
                      <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-800/20 bg-gradient-to-r from-emerald-50/70 to-white shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-slate-400 font-bold text-xs">⋮⋮</span>
                          <span className="font-bold text-xs text-slate-800">{item.label}</span>
                          {item.children && item.children.length > 0 && (
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              {item.children.length} sub
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 font-mono">{item.url}</span>
                          <button
                            type="button"
                            title="Add Sub Item"
                            onClick={() => {
                              setEditingItem({ id: String(Date.now()), label: '', url: '', level: 2, parentId: item.id, children: [] });
                              setIsModalOpen(true);
                            }}
                            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded border-none"
                          >
                            + Sub
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({ ...item });
                              setIsModalOpen(true);
                            }}
                            className="flex gap-1 px-3 py-1.5 rounded-lg bg-gold/50 text-primary no-underline text-[11px] font-bold hover:bg-gold transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newTree = navTree.filter(t => t.id !== item.id);
                              handleSaveNav(newTree);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Level 2 Sub-items */}
                      {item.children && item.children.map((sub: any) => (
                        <div key={sub.id} className="ml-6 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between p-2.5 rounded-xl border border-teal-200 bg-teal-50/70 shadow-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-teal-400 font-bold text-xs">↳ ⋮⋮</span>
                              <span className="font-bold text-xs text-teal-900">{sub.label}</span>
                              {sub.children && sub.children.length > 0 && (
                                <span className="text-[10px] font-extrabold bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full">
                                  {sub.children.length} sub
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-teal-700 font-mono">{sub.url}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItem({ ...sub, parentId: item.id });
                                  setIsModalOpen(true);
                                }}
                                className="flex gap-1 px-3 py-1.5 rounded-lg bg-gold/50 text-primary no-underline text-[11px] font-bold hover:bg-gold transition-colors"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const newTree = navTree.map(t => {
                                    if (t.id === item.id) {
                                      return { ...t, children: t.children.filter((c: any) => c.id !== sub.id) };
                                    }
                                    return t;
                                  });
                                  handleSaveNav(newTree);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Level 3 Sub-items */}
                          {sub.children && sub.children.map((sub3: any) => (
                            <div key={sub3.id} className="ml-6 flex items-center justify-between p-2 rounded-lg border border-sky-200 bg-sky-50 shadow-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-sky-400 font-bold text-xs">↳↳ ⋮⋮</span>
                                <span className="font-bold text-xs text-sky-900">{sub3.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-sky-700 font-mono">{sub3.url}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingItem({ ...sub3, parentId: sub.id });
                                    setIsModalOpen(true);
                                  }}
                                  className="text-xs text-sky-800 font-bold cursor-pointer border-none bg-transparent"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTree = navTree.map(t => {
                                      if (t.id === item.id) {
                                        return {
                                          ...t,
                                          children: t.children.map((c: any) => {
                                            if (c.id === sub.id) {
                                              return { ...c, children: c.children.filter((c3: any) => c3.id !== sub3.id) };
                                            }
                                            return c;
                                          })
                                        };
                                      }
                                      return t;
                                    });
                                    handleSaveNav(newTree);
                                  }}
                                  className="text-xs text-red-500 font-bold cursor-pointer border-none bg-transparent"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Visibility Toggles */}
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4">
                  👁 VISIBILITY TOGGLES
                </h3>
                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold">Search Bar</div>
                      <div className="text-[11px] text-slate-400">Show the search input in the header</div>
                    </div>
                    <Field orientation="horizontal">
                      <Switch id="switch-search-bar" checked={showSearchBar} onChange={setShowSearchBar} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Bottom Action Save Bar */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                <div>
                  {identitySaveMsg && <span className="text-xs font-bold text-emerald-600">{identitySaveMsg}</span>}
                </div>
                <button
                  type="button"
                  onClick={handleSaveHeaderAll}
                  className="bg-[#004B39] text-white hover:bg-[#00382B] px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border-none"
                >
                  <Save className="w-4 h-4 text-emerald-300" /> Save Header Settings
                </button>
              </div>
            </div>
          )}

          {/* ================= FOOTER BUILDER PANEL ================= */}
          {activeTab === 'header-footer' && subTab === 'footer' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider m-0">
                  👣 FOOTER BRANDING, COLUMNS &amp; SWITCHES
                </h3>
                {footerSaveMsg && <span className="text-xs font-bold text-emerald-600">{footerSaveMsg}</span>}
              </div>

              {/* Footer Logo & Tagline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-4">
                <span className="text-xs font-bold text-[#004B39] uppercase">1. Footer Brand Logo &amp; Tagline</span>
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-center">
                  <div className="h-24 bg-[#004B39] rounded-xl p-3 flex flex-col items-center justify-center border border-slate-300">
                    {footerData.logo ? (
                      <img src={footerData.logo} alt="Footer Logo Preview" className="max-h-16 max-w-full object-contain" />
                    ) : (
                      <span className="text-xs text-white font-bold">No Logo</span>
                    )}
                    <span className="text-[9px] text-emerald-200 mt-1">Live Preview</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Footer Logo Image</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={footerData.logo || ''}
                          onChange={(e) => setFooterData({ ...footerData, logo: e.target.value })}
                          className="flex-1 p-2 rounded-lg border border-slate-300 text-xs bg-white"
                          placeholder="/img/logo-footer.png or Base64"
                        />
                        <label className="bg-[#004B39] text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await uploadFileToFtp(file, 'footer');
                                  if (url) setFooterData({ ...footerData, logo: url });
                                }
                              }}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Brand Tagline Description</label>
                      <textarea
                        rows={2}
                        value={footerData.tagline || ''}
                        onChange={(e) => setFooterData({ ...footerData, tagline: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links Manager */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#004B39] uppercase">2. Follow Us Social Links (With New Tab Switch)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = [...(footerData.socialLinks || [])];
                      current.push({ name: 'New Network', url: 'https://', icon: '', openInNewTab: true });
                      setFooterData({ ...footerData, socialLinks: current });
                    }}
                    className="bg-[#004B39] text-white px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer"
                  >
                    + Add Social Icon
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(footerData.socialLinks || []).map((item: any, sIdx: number) => (
                    <div key={sIdx} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Icon #{sIdx + 1}: {item.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (footerData.socialLinks || []).filter((_: any, i: number) => i !== sIdx);
                            setFooterData({ ...footerData, socialLinks: updated });
                          }}
                          className="text-white hover:bg-red-700 bg-red-600 border-none rounded-lg p-1.5 cursor-pointer flex items-center justify-center transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-[#004B39] rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-slate-200">
                          {item.icon ? (
                            <img src={item.icon} alt={item.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-[9px] text-white font-bold">Icon</span>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Name (e.g. Facebook)"
                              value={item.name || ''}
                              onChange={(e) => {
                                const updated = [...footerData.socialLinks];
                                updated[sIdx] = { ...updated[sIdx], name: e.target.value };
                                setFooterData({ ...footerData, socialLinks: updated });
                              }}
                              className="p-1.5 rounded border border-slate-300 text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Target URL (https://...)"
                              value={item.url || ''}
                              onChange={(e) => {
                                const updated = [...footerData.socialLinks];
                                updated[sIdx] = { ...updated[sIdx], url: e.target.value };
                                setFooterData({ ...footerData, socialLinks: updated });
                              }}
                              className="p-1.5 rounded border border-slate-300 text-xs font-mono"
                            />
                          </div>
                          <div className="flex gap-2 items-center justify-between">
                            <label className="flex bg-slate-200 text-slate-800 px-2 py-1 rounded text-[10px] font-bold cursor-pointer gap-2">
                              <CloudUpload className="w-3 h-3" /> Upload Icon
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                     const url = await uploadFileToFtp(file, 'social');
                                     if (url) {
                                       const updated = [...footerData.socialLinks];
                                       updated[sIdx] = { ...updated[sIdx], icon: url };
                                       setFooterData({ ...footerData, socialLinks: updated });
                                     }
                                   }
                                 }}
                              />
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-600">Open in New Tab</span>
                              <Switch
                                checked={item.openInNewTab ?? true}
                                onChange={(val) => {
                                  const updated = [...footerData.socialLinks];
                                  updated[sIdx] = { ...updated[sIdx], openInNewTab: val };
                                  setFooterData({ ...footerData, socialLinks: updated });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges Manager */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#004B39] uppercase">3. Trust Accreditation Badges</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = [...(footerData.trustBadges || [])];
                      current.push({ name: 'New Badge', icon: '' });
                      setFooterData({ ...footerData, trustBadges: current });
                    }}
                    className="bg-[#004B39] text-white px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer"
                  >
                    + Add Trust Badge
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {(footerData.trustBadges || []).map((badge: any, bIdx: number) => (
                    <div key={bIdx} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-2 items-center text-center">
                      <div className="h-12 w-full bg-slate-100 rounded-lg p-1 flex items-center justify-center border border-slate-200">
                        {badge.icon ? (
                          <img src={badge.icon} alt={badge.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-[9px] text-slate-400 font-bold">{badge.name}</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={badge.name || ''}
                        onChange={(e) => {
                          const updated = [...footerData.trustBadges];
                          updated[bIdx] = { ...updated[bIdx], name: e.target.value };
                          setFooterData({ ...footerData, trustBadges: updated });
                        }}
                        className="w-full p-1 rounded border border-slate-300 text-[10px] text-center font-bold"
                      />
                      <div className="flex gap-1 w-full justify-between items-center">
                        <label className="bg-emerald-700 text-white px-2 py-1 rounded text-[9px] font-bold cursor-pointer">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadFileToFtp(file, 'badges');
                                if (url) {
                                  const updated = [...footerData.trustBadges];
                                  updated[bIdx] = { ...updated[bIdx], icon: url };
                                  setFooterData({ ...footerData, trustBadges: updated });
                                }
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (footerData.trustBadges || []).filter((_: any, i: number) => i !== bIdx);
                            setFooterData({ ...footerData, trustBadges: updated });
                          }}
                          className="text-white hover:bg-red-700 text-xs bg-red-600 border-none rounded-lg p-1.5 cursor-pointer font-bold flex items-center justify-center transition-colors"
                          title="Remove badge"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2 & 3: Services & Sitemap Menu Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Services Column */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#004B39] uppercase">4. Services Column Links</span>
                    <button
                      type="button"
                      onClick={() => {
                        const current = [...(footerData.servicesLinks || [])];
                        current.push({ label: 'New Service Link', url: '/' });
                        setFooterData({ ...footerData, servicesLinks: current });
                      }}
                      className="bg-[#004B39] text-white px-2.5 py-1 rounded text-xs font-bold border-none cursor-pointer"
                    >
                      + Add Link
                    </button>
                  </div>
                  <input
                    type="text"
                    value={footerData.servicesTitle || 'SERVICES'}
                    onChange={(e) => setFooterData({ ...footerData, servicesTitle: e.target.value })}
                    className="p-2 rounded-lg border border-slate-300 text-xs font-bold text-[#004B39]"
                  />
                  <div className="flex flex-col gap-2">
                    {(footerData.servicesLinks || []).map((link: any, lIdx: number) => (
                      <div key={lIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Label"
                          value={link.label || ''}
                          onChange={(e) => {
                            const updated = [...footerData.servicesLinks];
                            updated[lIdx] = { ...updated[lIdx], label: e.target.value };
                            setFooterData({ ...footerData, servicesLinks: updated });
                          }}
                          className="flex-1 p-1.5 rounded border border-slate-300 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.url || ''}
                          onChange={(e) => {
                            const updated = [...footerData.servicesLinks];
                            updated[lIdx] = { ...updated[lIdx], url: e.target.value };
                            setFooterData({ ...footerData, servicesLinks: updated });
                          }}
                          className="flex-1 p-1.5 rounded border border-slate-300 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (footerData.servicesLinks || []).filter((_: any, i: number) => i !== lIdx);
                            setFooterData({ ...footerData, servicesLinks: updated });
                          }}
                          className="text-white hover:bg-red-700 text-xs bg-red-600 border-none rounded-lg p-1.5 cursor-pointer font-bold flex items-center justify-center transition-colors shrink-0"
                          title="Remove link"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sitemap Column */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#004B39] uppercase">5. Sitemap Column Links</span>
                    <button
                      type="button"
                      onClick={() => {
                        const current = [...(footerData.sitemapLinks || [])];
                        current.push({ label: 'New Page Link', url: '/' });
                        setFooterData({ ...footerData, sitemapLinks: current });
                      }}
                      className="bg-[#004B39] text-white px-2.5 py-1 rounded text-xs font-bold border-none cursor-pointer"
                    >
                      + Add Link
                    </button>
                  </div>
                  <input
                    type="text"
                    value={footerData.sitemapTitle || 'SITEMAP'}
                    onChange={(e) => setFooterData({ ...footerData, sitemapTitle: e.target.value })}
                    className="p-2 rounded-lg border border-slate-300 text-xs font-bold text-[#004B39]"
                  />
                  <div className="flex flex-col gap-2">
                    {(footerData.sitemapLinks || []).map((link: any, lIdx: number) => (
                      <div key={lIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Label"
                          value={link.label || ''}
                          onChange={(e) => {
                            const updated = [...footerData.sitemapLinks];
                            updated[lIdx] = { ...updated[lIdx], label: e.target.value };
                            setFooterData({ ...footerData, sitemapLinks: updated });
                          }}
                          className="flex-1 p-1.5 rounded border border-slate-300 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.url || ''}
                          onChange={(e) => {
                            const updated = [...footerData.sitemapLinks];
                            updated[lIdx] = { ...updated[lIdx], url: e.target.value };
                            setFooterData({ ...footerData, sitemapLinks: updated });
                          }}
                          className="flex-1 p-1.5 rounded border border-slate-300 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (footerData.sitemapLinks || []).filter((_: any, i: number) => i !== lIdx);
                            setFooterData({ ...footerData, sitemapLinks: updated });
                          }}
                          className="text-white hover:bg-red-700 text-xs bg-red-600 border-none rounded-lg p-1.5 cursor-pointer font-bold flex items-center justify-center transition-colors shrink-0"
                          title="Remove link"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 4: Customer Support Items */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#004B39] uppercase">6. Customer Support Column (With New Tab Switches)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = [...(footerData.supportItems || [])];
                      current.push({ text: 'New Support Detail', url: '', openInNewTab: false });
                      setFooterData({ ...footerData, supportItems: current });
                    }}
                    className="bg-[#004B39] text-white px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer"
                  >
                    + Add Support Row
                  </button>
                </div>

                <input
                  type="text"
                  value={footerData.supportTitle || '24/7 CUSTOMER SUPPORT'}
                  onChange={(e) => setFooterData({ ...footerData, supportTitle: e.target.value })}
                  className="p-2 rounded-lg border border-slate-300 text-xs font-bold text-[#004B39]"
                />

                <div className="flex flex-col gap-2.5">
                  {(footerData.supportItems || []).map((item: any, cIdx: number) => (
                    <div key={cIdx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                        <input
                          type="text"
                          placeholder="Display Text (e.g. +1905-624-8555)"
                          value={item.text || ''}
                          onChange={(e) => {
                            const updated = [...footerData.supportItems];
                            updated[cIdx] = { ...updated[cIdx], text: e.target.value };
                            setFooterData({ ...footerData, supportItems: updated });
                          }}
                          className="p-1.5 rounded border border-slate-300 text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Action Link (e.g. tel:+19056248555 or mailto:...)"
                          value={item.url || ''}
                          onChange={(e) => {
                            const updated = [...footerData.supportItems];
                            updated[cIdx] = { ...updated[cIdx], url: e.target.value };
                            setFooterData({ ...footerData, supportItems: updated });
                          }}
                          className="p-1.5 rounded border border-slate-300 text-xs font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-600">Open in New Tab</span>
                          <Switch
                            checked={item.openInNewTab ?? false}
                            onChange={(val) => {
                              const updated = [...footerData.supportItems];
                              updated[cIdx] = { ...updated[cIdx], openInNewTab: val };
                              setFooterData({ ...footerData, supportItems: updated });
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (footerData.supportItems || []).filter((_: any, i: number) => i !== cIdx);
                            setFooterData({ ...footerData, supportItems: updated });
                          }}
                          className="text-white hover:bg-red-700 bg-red-600 border-none rounded-lg p-1.5 cursor-pointer flex items-center justify-center transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Bottom Bar: Copyright & Developer Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Copyright Text</label>
                  <input
                    type="text"
                    value={footerData.copyrightText || ''}
                    onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Developer Attribution Text &amp; URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={footerData.developerText || ''}
                      onChange={(e) => setFooterData({ ...footerData, developerText: e.target.value })}
                      className="flex-1 p-2 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                    />
                    <input
                      type="text"
                      value={footerData.developerUrl || ''}
                      onChange={(e) => setFooterData({ ...footerData, developerUrl: e.target.value })}
                      className="w-40 p-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveFooter}
                  className="bg-[#004B39] text-white px-7 py-2.5 rounded-xl font-extrabold text-xs border-none cursor-pointer shadow-md hover:bg-[#00382B] transition-colors"
                >
                  💾 Save Footer Settings
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 3: SITE IDENTITY (Exact Template Match) ================= */}
          {activeTab === 'identity' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 m-0">Site Identity</h2>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">Manage your website&apos;s core branding and metadata.</p>
                </div>
                <div className="flex items-center gap-3">
                  {identitySaveMsg && <span className="text-xs font-bold text-emerald-600">{identitySaveMsg}</span>}
                  <button
                    type="button"
                    onClick={handleSaveIdentity}
                    className="bg-[#004B39] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold hover:bg-[#00382B] transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3 h-3" /> Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Card: Basic Information */}
                <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col gap-5">
                  <h3 className="text-sm font-bold text-slate-800 m-0">Basic Information</h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={identityData.siteName || ''}
                      onChange={(e) => setIdentityData({ ...identityData, siteName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-emerald-50/30 text-xs font-semibold text-slate-900 outline-none focus:border-[#004B39]"
                      placeholder="Enter site name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Tagline / Description</label>
                    <textarea
                      rows={3}
                      value={identityData.tagline || ''}
                      onChange={(e) => setIdentityData({ ...identityData, tagline: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-emerald-50/30 text-xs font-medium text-slate-900 outline-none focus:border-[#004B39]"
                      placeholder="Describe your site for search engines and headers..."
                    />
                  </div>
                </div>

                {/* Right Card: Branding Assets */}
                <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col gap-5">
                  <h3 className="text-sm font-bold text-slate-800 m-0">Branding Assets</h3>

                  {/* Site Logo Uploader & Preview */}
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-bold text-slate-700">Site Logo</label>
                    <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center relative min-h-[140px] text-center">
                      {identityData.logo ? (
                        <img src={identityData.logo} alt="Site Logo" className="max-h-24 max-w-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400 font-bold">Click to upload site logo</span>
                      )}
                      <div className="flex gap-2 items-center mt-3">
                        <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border border-slate-300 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> {identityData.logo ? 'Change Logo Image' : 'Upload Logo Image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadFileToFtp(file, 'branding');
                                if (url) setIdentityData({ ...identityData, logo: url });
                              }
                            }}
                          />
                        </label>
                        {identityData.logo && (
                          <button
                            type="button"
                            onClick={() => setIdentityData({ ...identityData, logo: '' })}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">ALTERNATIVE TEXT</label>
                    <input
                      type="text"
                      value={identityData.logoAlt || ''}
                      onChange={(e) => setIdentityData({ ...identityData, logoAlt: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/30 text-xs outline-none"
                      placeholder="Describe this image for accessibility..."
                    />
                  </div>

                  {/* Favicon Uploader & Preview */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700">Favicon</label>
                    <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 bg-emerald-950 flex flex-col items-center justify-center relative min-h-[120px]">
                      {identityData.favicon ? (
                        <img src={identityData.favicon} alt="Favicon" className="max-h-16 max-w-full object-contain bg-white/10 p-2 rounded-lg" />
                      ) : (
                        <span className="text-xs text-emerald-200 font-bold">Upload Favicon (.ico, .png)</span>
                      )}
                      <div className="flex gap-2 items-center mt-3">

                        <label className="bg-emerald-900 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> {identityData.favicon ? 'Change Favicon' : 'Upload Favicon'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadFileToFtp(file, 'branding');
                                if (url) setIdentityData({ ...identityData, favicon: url });
                              }
                            }}
                          />
                        </label>
                        {identityData.favicon && (
                          <button
                            type="button"
                            onClick={() => setIdentityData({ ...identityData, favicon: '' })}
                            className="bg-red-950/80 hover:bg-red-900 text-red-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-700/50 cursor-pointer flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>


                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">ALTERNATIVE TEXT</label>
                    <input
                      type="text"
                      value={identityData.faviconAlt || ''}
                      onChange={(e) => setIdentityData({ ...identityData, faviconAlt: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/30 text-xs outline-none"
                      placeholder="Describe this image for accessibility..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: SHARE TOOLS (Exact Template Match) ================= */}
          {activeTab === 'share' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 m-0">Share Tools</h2>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">Configure the global floating share sidebar for your website.</p>
                </div>
                <div className="flex items-center gap-3">
                  {shareSaveMsg && <span className="text-xs font-bold text-emerald-600">{shareSaveMsg}</span>}
                  <button
                    type="button"
                    disabled={savingShare}
                    onClick={handleSaveShareTools}
                    className="bg-[#004B39] text-white px-6 py-2.5 rounded-full text-xs font-extrabold hover:bg-[#00382B] transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {savingShare ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </div>

              {/* Grid Layout: Config Panels on Left, Live Preview Mockup on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left 2 Columns: Settings Sections */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                  {/* 1. Display Settings */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-4 shadow-xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0">Display Settings</h3>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Enable Share Sidebar</div>
                        <div className="text-[11px] text-slate-500">Turn the floating share tools on or off globally.</div>
                      </div>
                      <Switch
                        checked={shareData.enabled === true || shareData.enabled === 'true'}
                        onChange={(val) => setShareData({ ...shareData, enabled: val })}
                      />
                    </div>
                  </div>

                  {/* 2. Appearance & Style */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-4 shadow-xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0">Appearance &amp; Style</h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Icon Style</label>
                      <div className="flex gap-3 flex-wrap">
                        {['Rounded Square', 'Circle', 'Flat', 'Minimal'].map((style) => {
                          const val = style.toLowerCase().replace(' ', '-');
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setShareData({ ...shareData, iconStyle: val })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors border ${shareData.iconStyle === val
                                ? 'bg-[#004B39] text-white border-[#004B39]'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                }`}
                            >
                              {style}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Icon Size</span>
                        <span>{shareData.iconSize || 40}px</span>
                      </div>
                      <input
                        type="range"
                        min="24"
                        max="64"
                        value={shareData.iconSize || 40}
                        onChange={(e) => setShareData({ ...shareData, iconSize: Number(e.target.value) })}
                        className="w-full accent-[#004B39]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Color Scheme</label>
                      <div className="flex gap-3 flex-wrap">
                        {[
                          { label: 'Brand Colors', val: 'brand-colors' },
                          { label: 'Monochrome', val: 'monochrome' },
                          { label: 'Custom', val: 'custom' },
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setShareData({ ...shareData, colorScheme: item.val })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors border ${shareData.colorScheme === item.val
                              ? 'bg-[#004B39] text-white border-[#004B39]'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                              }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {shareData.colorScheme === 'custom' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Background Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={shareData.customBgColor || '#004B39'}
                                onChange={(e) => setShareData({ ...shareData, customBgColor: e.target.value })}
                                className="w-8 h-8 rounded border-none cursor-pointer"
                              />
                              <input
                                type="text"
                                value={shareData.customBgColor || '#004B39'}
                                onChange={(e) => setShareData({ ...shareData, customBgColor: e.target.value })}
                                className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Text / Icon Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={shareData.customTextColor || '#ffffff'}
                                onChange={(e) => setShareData({ ...shareData, customTextColor: e.target.value })}
                                className="w-8 h-8 rounded border-none cursor-pointer"
                              />
                              <input
                                type="text"
                                value={shareData.customTextColor || '#ffffff'}
                                onChange={(e) => setShareData({ ...shareData, customTextColor: e.target.value })}
                                className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Gap from Edge (px)</label>
                        <input
                          type="number"
                          value={shareData.gapFromEdge ?? 20}
                          onChange={(e) => setShareData({ ...shareData, gapFromEdge: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Vertical Position</label>
                        <select
                          value={shareData.verticalPosition || 'center'}
                          onChange={(e) => setShareData({ ...shareData, verticalPosition: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-semibold"
                        >
                          <option value="top">Top</option>
                          <option value="center">Center</option>
                          <option value="bottom">Bottom</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sidebar Edge</label>
                      <select
                        value={shareData.sidebarEdge || 'right'}
                        onChange={(e) => setShareData({ ...shareData, sidebarEdge: e.target.value })}
                        className="w-48 p-2.5 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-semibold"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. Behavior Settings */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-4 shadow-xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0">Behavior Settings</h3>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Show Labels</div>
                        <div className="text-[11px] text-slate-500">Display platform name text.</div>
                      </div>
                      <Switch
                        checked={shareData.showLabels ?? true}
                        onChange={(val) => setShareData({ ...shareData, showLabels: val })}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Hide on Scroll Down</div>
                        <div className="text-[11px] text-slate-500">Auto-hide when scrolling down.</div>
                      </div>
                      <Switch
                        checked={shareData.hideOnScrollDown ?? false}
                        onChange={(val) => setShareData({ ...shareData, hideOnScrollDown: val })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Open Behavior</label>
                        <select
                          value={shareData.openBehavior || 'popup'}
                          onChange={(e) => setShareData({ ...shareData, openBehavior: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-semibold"
                        >
                          <option value="popup">New Tab / Popup</option>
                          <option value="same-tab">Same Tab</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Delay Before Showing (ms)</label>
                        <input
                          type="number"
                          value={shareData.delayBeforeShowing ?? 0}
                          onChange={(e) => setShareData({ ...shareData, delayBeforeShowing: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Exclude Pages</label>
                      <input
                        type="text"
                        value={shareData.excludePages || ''}
                        onChange={(e) => setShareData({ ...shareData, excludePages: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-mono"
                        placeholder="/cart, /checkout, /private"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Enter paths separated by commas where the sidebar should not appear.</span>
                    </div>
                  </div>

                  {/* 4. Share URL Settings */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-4 shadow-xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0">Share URL Settings</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">URL to Share</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                          <input
                            type="radio"
                            name="urlToShare"
                            value="current"
                            checked={shareData.urlToShare === 'current'}
                            onChange={() => setShareData({ ...shareData, urlToShare: 'current' })}
                            className="accent-[#004B39]"
                          />
                          Current Page URL
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                          <input
                            type="radio"
                            name="urlToShare"
                            value="custom"
                            checked={shareData.urlToShare === 'custom'}
                            onChange={() => setShareData({ ...shareData, urlToShare: 'custom' })}
                            className="accent-[#004B39]"
                          />
                          Custom URL
                        </label>
                      </div>
                      {shareData.urlToShare === 'custom' && (
                        <input
                          type="text"
                          value={shareData.customShareUrl || ''}
                          onChange={(e) => setShareData({ ...shareData, customShareUrl: e.target.value })}
                          className="w-full mt-2 p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                          placeholder="https://kingtravelcan.com/special-offer"
                        />
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">UTM Parameters</div>
                        <div className="text-[11px] text-slate-500">Append UTM tags to shared links.</div>
                      </div>
                      <Switch
                        checked={shareData.utmParameters ?? false}
                        onChange={(val) => setShareData({ ...shareData, utmParameters: val })}
                      />
                    </div>
                  </div>

                  {/* 5. Analytics */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-4 shadow-xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0">Analytics</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Track Share Clicks</div>
                        <div className="text-[11px] text-slate-500">Send events to Google Analytics.</div>
                      </div>
                      <Switch
                        checked={shareData.trackClicks ?? true}
                        onChange={(val) => setShareData({ ...shareData, trackClicks: val })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">GA Event Name</label>
                      <input
                        type="text"
                        value={shareData.gaEventName || 'share_click'}
                        onChange={(e) => setShareData({ ...shareData, gaEventName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* 6. Active Platforms (Drag/Reorder & Toggle) */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-4 shadow-xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0">Active Platforms</h3>
                    <span className="text-[11px] text-slate-500">Drag/reorder or toggle checkbox to enable/disable sharing channels.</span>

                    <div className="flex flex-col gap-2">
                      {(shareData.activePlatforms || []).map((p: any, pIdx: number) => (
                        <div key={p.id || pIdx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-emerald-50/10">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 font-bold text-xs cursor-move">⋮⋮</span>
                            <input
                              type="checkbox"
                              checked={p.enabled ?? true}
                              onChange={(e) => {
                                const updated = [...shareData.activePlatforms];
                                updated[pIdx] = { ...updated[pIdx], enabled: e.target.checked };
                                setShareData({ ...shareData, activePlatforms: updated });
                              }}
                              className="accent-[#004B39] w-4 h-4 rounded cursor-pointer"
                            />
                            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" ref={(el) => { if (el) el.style.backgroundColor = p.color || '#004B39'; }}>
                              {p.name.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-slate-800">{p.name}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={pIdx === 0}
                              onClick={() => {
                                const updated = [...shareData.activePlatforms];
                                const temp = updated[pIdx - 1];
                                updated[pIdx - 1] = updated[pIdx];
                                updated[pIdx] = temp;
                                setShareData({ ...shareData, activePlatforms: updated });
                              }}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer bg-transparent border-none"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={pIdx === shareData.activePlatforms.length - 1}
                              onClick={() => {
                                const updated = [...shareData.activePlatforms];
                                const temp = updated[pIdx + 1];
                                updated[pIdx + 1] = updated[pIdx];
                                updated[pIdx] = temp;
                                setShareData({ ...shareData, activePlatforms: updated });
                              }}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer bg-transparent border-none"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Live Preview Mockup Browser Window */}
                <div className="sticky top-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-bold text-slate-400 ml-2">Live Web Preview</span>
                  </div>

                  {/* Wireframe Web Page Content */}
                  <div className="relative bg-slate-950 rounded-xl p-4 min-h-[380px] overflow-hidden flex flex-col gap-3 border border-slate-800">
                    <div className="h-6 bg-slate-800 rounded-md w-3/4"></div>
                    <div className="h-3 bg-slate-850 rounded-sm w-full"></div>
                    <div className="h-3 bg-slate-850 rounded-sm w-5/6"></div>
                    <div className="h-28 bg-slate-850 rounded-lg w-full mt-2"></div>

                    {/* Floating Share Bar Render in Preview */}
                    {shareData.enabled && (
                      <div
                        className="absolute flex flex-col gap-2 p-2 rounded-xl bg-white/90 backdrop-blur-md shadow-2xl border border-slate-200 transition-all duration-300"
                        ref={(el) => {
                          if (el) {
                            const isLeft = shareData.sidebarEdge === 'left';
                            const edgePx = `${Math.max(6, (shareData.gapFromEdge || 20) / 2)}px`;
                            if (isLeft) {
                              el.style.left = edgePx;
                              el.style.right = 'auto';
                            } else {
                              el.style.right = edgePx;
                              el.style.left = 'auto';
                            }
                            el.style.top = shareData.verticalPosition === 'top' ? '20px' : shareData.verticalPosition === 'bottom' ? 'auto' : '50%';
                            el.style.bottom = shareData.verticalPosition === 'bottom' ? '20px' : 'auto';
                            el.style.transform = shareData.verticalPosition === 'center' ? 'translateY(-50%)' : 'none';
                          }
                        }}
                      >
                        {(shareData.activePlatforms || [])
                          .filter((p: any) => p.enabled)
                          .map((p: any) => {
                            let bg = p.color || '#004B39';
                            let txtColor = '#ffffff';
                            if (shareData.colorScheme === 'monochrome') {
                              bg = '#334155';
                            } else if (shareData.colorScheme === 'custom') {
                              bg = shareData.customBgColor || '#004B39';
                              txtColor = shareData.customTextColor || '#ffffff';
                            }

                            const radiusClass =
                              shareData.iconStyle === 'circle'
                                ? 'rounded-full'
                                : shareData.iconStyle === 'flat'
                                  ? 'rounded-none'
                                  : shareData.iconStyle === 'minimal'
                                    ? 'rounded-md shadow-none'
                                    : 'rounded-lg';

                            return (
                              <div
                                key={p.id}
                                className={`flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform hover:scale-105 ${radiusClass}`}
                                ref={(el) => {
                                  if (el) {
                                    el.style.backgroundColor = bg;
                                    el.style.color = txtColor;
                                    el.style.padding = shareData.showLabels ? '4px 8px' : '6px';
                                  }
                                }}
                              >
                                <span className="text-[11px] font-extrabold flex items-center justify-center w-4 h-4" ref={(el) => { if (el) el.style.color = txtColor; }}>
                                  {p.name.charAt(0)}
                                </span>
                                {shareData.showLabels && (
                                  <span className="text-[9px] font-bold pr-1" ref={(el) => { if (el) el.style.color = txtColor; }}>{p.name}</span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 text-center">Changes reflect live in preview above based on selected options.</span>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 5: USERS MANAGEMENT ================= */}
          {activeTab === 'users' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 m-0">User Management</h2>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">Manage administrators and restricted editors</p>
                </div>
                <div className="flex items-center gap-3">
                  {userSaveMsg && <span className="text-xs font-bold text-emerald-600">{userSaveMsg}</span>}
                  <button
                    type="button"
                    onClick={handleOpenAddUser}
                    className="bg-[#004B39] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold hover:bg-[#00382B] transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                      <th className="p-4 pl-6">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 font-normal">
                          No users found. Click &quot;Add User&quot; to create your first account.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900">{u.name}</span>
                                  <span
                                    className="px-2 py-0.5 rounded-md text-[10px] font-extrabold inline-block"
                                    ref={(el) => {
                                      if (el) {
                                        el.style.backgroundColor = u.badgeBg || '#0F766E';
                                        el.style.color = u.badgeTextColor || '#FFFFFF';
                                      }
                                    }}
                                  >
                                    Badge
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="capitalize font-semibold text-slate-700">
                              {u.role === 'super_admin'
                                ? 'Full Admin'
                                : u.role === 'admin'
                                  ? 'Full Admin'
                                  : u.role === 'content_editor'
                                    ? 'Content Editor'
                                    : u.role === 'enquiry_manager'
                                      ? 'Enquiry Manager'
                                      : 'SEO Manager'}
                            </span>
                          </td>
                          <td className="p-4">
                            {u.active ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold inline-block">
                                Active
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold inline-block">
                                Disabled
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-500 font-medium">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString('en-US', {
                                month: 'numeric',
                                day: 'numeric',
                                year: 'numeric',
                              })
                              : '6/2/2026'}
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(u)}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit User"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add / Edit User Modal */}
              {userModalOpen && (
                <div className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 relative flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="text-base font-extrabold text-slate-900 m-0">
                        {userModalMode === 'create' ? 'Add New User' : 'Edit User'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setUserModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1 border-none bg-transparent cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveUser} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={userFormData.name}
                          onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold"
                          placeholder="e.g. Abdullah Khan"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={userFormData.email}
                          onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold"
                          placeholder="user@tanzeem.org"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            {userModalMode === 'edit' ? 'Password (Leave blank to keep unchanged)' : 'Password'}
                          </label>
                          <button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="text-xs font-bold text-[#004B39] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                          >
                            <Key className="w-3 h-3" /> Auto-generate
                          </button>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type={showModalPassword ? 'text' : 'password'}
                            value={userFormData.password}
                            onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                            className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowModalPassword(!showModalPassword)}
                            className="absolute right-3 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                          >
                            {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment</label>
                          <select
                            value={userFormData.role}
                            onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold"
                          >
                            <option value="admin">Full Admin</option>
                            <option value="content_editor">Restricted Editor</option>
                            <option value="enquiry_manager">Enquiry Manager</option>
                            <option value="seo_manager">SEO Manager</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                          <select
                            value={userFormData.active ? 'active' : 'disabled'}
                            onChange={(e) => setUserFormData({ ...userFormData, active: e.target.value === 'active' })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold"
                          >
                            <option value="active">Active (Allowed)</option>
                            <option value="disabled">Disabled (Blocked)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-700">User Badge Custom Colors</label>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <span>Preview:</span>
                            <span
                              className="px-2.5 py-0.5 rounded-md text-xs font-bold transition-colors"
                              ref={(el) => {
                                if (el) {
                                  el.style.backgroundColor = userFormData.badgeBg || '#0F766E';
                                  el.style.color = userFormData.badgeTextColor || '#FFFFFF';
                                }
                              }}
                            >
                              {userFormData.name || 'User'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Badge Background</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={userFormData.badgeBg || '#0F766E'}
                                onChange={(e) => setUserFormData({ ...userFormData, badgeBg: e.target.value })}
                                className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={userFormData.badgeBg || '#0F766E'}
                                onChange={(e) => setUserFormData({ ...userFormData, badgeBg: e.target.value })}
                                className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Badge Text Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={userFormData.badgeTextColor || '#FFFFFF'}
                                onChange={(e) => setUserFormData({ ...userFormData, badgeTextColor: e.target.value })}
                                className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={userFormData.badgeTextColor || '#FFFFFF'}
                                onChange={(e) => setUserFormData({ ...userFormData, badgeTextColor: e.target.value })}
                                className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setUserModalOpen(false)}
                          className="px-4 py-2 rounded-full border border-red-300 text-red-600 text-xs font-bold hover:bg-red-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-full bg-[#004B39] text-white text-xs font-bold hover:bg-[#00382B] cursor-pointer"
                        >
                          {userModalMode === 'create' ? 'Create User' : 'Update User'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 6: LOGIN AUTH SETTINGS ================= */}
          {activeTab === 'auth' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 m-0">Login Authentication UI Settings</h2>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">
                    Configure the cinematic 3D login screen&apos;s background, logo, and footer text.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {loginSaveMsg && <span className="text-xs font-bold text-emerald-600">{loginSaveMsg}</span>}
                  <button
                    type="button"
                    disabled={savingLogin}
                    onClick={handleSaveLoginAuth}
                    className="bg-[#004B39] text-white px-6 py-2.5 rounded-full text-xs font-extrabold hover:bg-[#00382B] transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {savingLogin ? 'Saving...' : 'Save Login Settings'}
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col gap-5 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Left Column: Background Image Uploader */}
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-bold text-slate-700">Login Page Background Image</label>
                    <div className="p-6 rounded-2xl border border-slate-300 bg-slate-500/80 flex flex-col items-center justify-center relative min-h-[160px] text-center overflow-hidden">
                      {loginAuthData.backgroundImage ? (
                        <img
                          src={loginAuthData.backgroundImage}
                          alt="Login Background"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-200 font-bold z-10">Upload background image</span>
                      )}
                      <div className="flex gap-2 items-center z-10 bg-slate-900/60 p-2 rounded-xl backdrop-blur-xs">
                        <label className="bg-white hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border border-slate-300 flex items-center gap-1.5 shadow-xs">
                          <Upload className="w-3.5 h-3.5" /> {loginAuthData.backgroundImage ? 'Change Image' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadFileToFtp(file, 'login');
                                if (url) setLoginAuthData({ ...loginAuthData, backgroundImage: url });
                              }
                            }}
                          />
                        </label>
                        {loginAuthData.backgroundImage && (
                          <button
                            type="button"
                            onClick={() => setLoginAuthData({ ...loginAuthData, backgroundImage: '' })}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        ALTERNATIVE TEXT
                      </label>
                      <input
                        type="text"
                        value={loginAuthData.backgroundAlt || ''}
                        onChange={(e) => setLoginAuthData({ ...loginAuthData, backgroundAlt: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-semibold outline-none"
                        placeholder="Describe this image for accessibility..."
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Upload a high-quality background for the login page (1920x1080 recommended).
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Footer Text */}
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-bold text-slate-700">Login Footer Text</label>
                    <input
                      type="text"
                      value={loginAuthData.footerText || ''}
                      onChange={(e) => setLoginAuthData({ ...loginAuthData, footerText: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-emerald-50/20 text-xs font-semibold outline-none focus:border-[#004B39]"
                      placeholder="© 2026 King Travel Can Ltd. All Rights Reserved."
                    />
                  </div>
                </div>

                {/* System Maintenance Section */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span>⚠️</span> System Maintenance
                  </h3>
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-amber-500/10 border border-amber-200">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Maintenance Mode</div>
                      <div className="text-[11px] text-slate-600">
                        When active, the frontend will display a maintenance page. You will still be able to access the admin panel.
                      </div>
                    </div>
                    <Switch
                      checked={loginAuthData.maintenanceMode ?? false}
                      onChange={(val) => setLoginAuthData({ ...loginAuthData, maintenanceMode: val })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 7: DISCLAIMER POPUP SETTINGS ================= */}
          {activeTab === 'popup' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 m-0 flex items-center gap-2">
                    <span>🚩</span> Disclaimer Popup Settings
                  </h2>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">
                    Configure the disclaimer image that appears on the homepage when a user visits the site.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Box: Disclaimer Image Uploader */}
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold text-slate-700">Disclaimer Image</label>
                  <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center relative min-h-[180px] group hover:border-[#004B39] transition-colors">
                    {disclaimerData.image ? (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden flex items-center justify-center bg-slate-900/10">
                        <img src={disclaimerData.image} alt="Disclaimer" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="bg-white hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border border-slate-300 flex items-center gap-1.5 shadow-xs">
                            <Upload className="w-3.5 h-3.5" /> Change Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadFileToFtp(file, 'disclaimer');
                                if (url) setDisclaimerData({ ...disclaimerData, image: url });
                              }
                            }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setDisclaimerData({ ...disclaimerData, image: '' })}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#004B39] flex items-center justify-center mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold text-slate-800 mb-0.5">Click to upload or drag and drop</div>
                        <div className="text-[11px] text-slate-400">WebP, PNG &amp; SVG (max. 50KB)</div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadFileToFtp(file, 'disclaimer');
                                if (url) setDisclaimerData({ ...disclaimerData, image: url });
                              }
                            }}
                        />
                      </label>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">Upload the image to be shown in the popup.</span>
                </div>

                {/* Right Box: Enable Disclaimer Popup Switch */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex justify-between items-center">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 mb-1">Enable Disclaimer Popup</div>
                    <div className="text-xs text-slate-500">Toggle whether the disclaimer popup is active on the homepage.</div>
                  </div>
                  <Switch
                    checked={disclaimerData.enabled ?? false}
                    onChange={(val) => setDisclaimerData({ ...disclaimerData, enabled: val })}
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 pt-4">
                {disclaimerSaveMsg && <span className="text-xs font-bold text-emerald-600">{disclaimerSaveMsg}</span>}
                <button
                  type="button"
                  disabled={savingDisclaimer}
                  onClick={handleSaveDisclaimer}
                  className="bg-[#004B39] text-white px-8 py-3 rounded-full text-xs font-extrabold hover:bg-[#00382B] transition-colors border-none cursor-pointer shadow-md disabled:opacity-50"
                >
                  {savingDisclaimer ? 'Saving...' : 'Save Disclaimer Settings'}
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 8: GLOBAL CSS OVERRIDES ================= */}
          {activeTab === 'css' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 m-0 flex items-center gap-2">
                    <span>🎨</span> Global CSS Overrides
                  </h2>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">
                    Write custom CSS to override styles across the entire frontend and backend. These styles will be injected with maximum priority.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-900 overflow-hidden shadow-xl bg-[#040817]">
                <textarea
                  rows={16}
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  className="w-full p-6 font-mono text-xs text-emerald-400 bg-transparent outline-none resize-y leading-relaxed border-none focus:ring-0"
                  placeholder="/* Add your custom CSS here */ body { /* overrides */ }"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-2">
                {cssSaveMsg && <span className="text-xs font-bold text-emerald-600">{cssSaveMsg}</span>}
                <button
                  type="button"
                  onClick={handleSaveCss}
                  className="bg-[#004B39] text-white px-8 py-3 rounded-full text-xs font-extrabold hover:bg-[#00382B] transition-colors border-none cursor-pointer shadow-md"
                >
                  Save CSS Overrides
                </button>
              </div>
            </div>
          )}

          {/* ================= FORMS TAB ================= */}
          {activeTab === 'forms' && (
            <div className="flex flex-col gap-6">
              {/* FORMS MANAGEMENT Header with Universal Save Form Button */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 m-0 flex items-center gap-2">
                    🚩 FORMS MANAGEMENT
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 mb-0">
                    Configure titles, email routing, notification templates, submission inbox, and form field inputs across King Travel.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {formsSaveMsg && (
                    <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                      {formsSaveMsg}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveFormsSettings}
                    disabled={savingForms}
                    className="bg-[#004B39] hover:bg-[#00382B] text-white px-6 py-2.5 rounded-full text-xs font-extrabold transition-colors cursor-pointer border-none shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-emerald-300" />
                    {savingForms
                      ? 'Saving Settings...'
                      : formsSubTab === 'emailConfigs'
                      ? 'Save Email Configs'
                      : formsSubTab === 'emailTemplate'
                      ? 'Save Email Template'
                      : 'Save Forms'}
                  </button>
                </div>
              </div>

              {/* Sub-tabs Navigation Pills Bar (Only Core Email & All Forms Tabs) */}
              <div className="flex items-center gap-2 bg-[#E6ECEB] p-2 rounded-2xl border border-slate-200/80 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Forms', icon: '📋' },
                  { id: 'emailConfigs', label: 'Email Configs', icon: '⚙️' },
                  { id: 'emailTemplate', label: 'Email Template', icon: '🎨' },
                  { id: 'inbox', label: 'Inbox', icon: '📥' },
                  { id: 'sentHistory', label: 'Sent History', icon: '📤' },
                  { id: 'emailLogs', label: 'Email Logs', icon: '📊' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setFormsSubTab(st.id as any);
                      setEditingFormKey(null);
                    }}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-transparent cursor-pointer flex items-center gap-2 whitespace-nowrap ${formsSubTab === st.id
                      ? 'bg-[#004B39] text-white border-[#004B39] shadow-sm'
                      : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200'
                      }`}
                  >
                    <span>{st.icon}</span>
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>

              {/* ── 1. ALL FORMS SUB-TAB (Grids of all forms with Status Dropdowns & Field Inputs Manager) ── */}
              {formsSubTab === 'all' && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">All Dynamic Website Forms</h3>
                      <p className="text-xs text-slate-500 mt-1 mb-0">Overview of active forms, field inputs count, recipient routing, and field manager.</p>
                    </div>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                      {Object.keys(formsData).length} Active Forms
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(formsData).map((formKey) => {
                      const DEFAULT_META: Record<string, { title: string; icon: string; desc: string }> = {
                        quoteForm: { title: 'Get a Free Quote Form', icon: '📋', desc: 'Homepage & landing page Get a Free Quote banner form.' },
                        packageDetailForm: { title: 'Package Detail Page Booking Form', icon: '🛍️', desc: 'Dedicated package detail page booking & reservation form.' },
                        contact: { title: 'Contact Us Form', icon: '💬', desc: 'Main public contact page form for general inquiries & support.' },
                        packageInquiry: { title: 'Package Inquiry Form', icon: '🕋', desc: 'Custom Umrah & Hajj package booking inquiry form.' },
                        visaConsultation: { title: 'Visa Consultation Form', icon: '📜', desc: 'Saudi eVisa & Pilgrimage visa application form.' },
                        flightInquiry: { title: 'Flight Booking Form', icon: '✈️', desc: 'Direct flight quote assistance request form.' },
                      };

                      const cfg = formsData[formKey] || {};
                      const meta = DEFAULT_META[formKey] || {
                        title: cfg.title || formKey,
                        icon: '📝',
                        desc: cfg.subtitle || 'Custom dynamic form.',
                      };
                      const fieldsList = formFieldsState[formKey] || [];
                      const isEditingThisForm = editingFormKey === formKey;
                      const f = { key: formKey, title: meta.title, icon: meta.icon, desc: meta.desc };

                      return (
                        <div
                          key={f.key}
                          className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                            isEditingThisForm
                              ? 'bg-[#DB9E30]/50 border-[#DB9E30] shadow-md'
                              : 'bg-white border-slate-100 shadow-2xs hover:border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3 gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl">{f.icon}</span>
                                <div>
                                  <h4 className="text-base font-extrabold text-slate-900 m-0">{f.title}</h4>
                                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                    🗄️ DB Table: {
                                      formKey === 'quoteForm' ? 'quote_enquiries' :
                                      formKey === 'packageDetailForm' ? 'package_booking_enquiries' :
                                      formKey === 'contact' ? 'contact_enquiries' :
                                      formKey === 'visaConsultation' ? 'visa_enquiries' :
                                      formKey === 'flightInquiry' ? 'flight_enquiries' : 'enquiries'
                                    }
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Interactive Status Dropdown (Active vs Disabled) */}
                                <select
                                  value={cfg.enabled ?? true ? 'active' : 'disabled'}
                                  onChange={(e) => {
                                    const isAct = e.target.value === 'active';
                                    setFormsData((prev: any) => ({
                                      ...prev,
                                      [f.key]: { ...prev[f.key], enabled: isAct },
                                    }));
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold outline-none cursor-pointer border transition-colors ${cfg.enabled ?? true
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-50 text-[#DB9E30] border-[#DB9E30]/50 font-bold'
                                    }`}
                                >
                                  <option value="active">● Active</option>
                                  <option value="disabled">● Disabled</option>
                                </select>

                                {/* X Remove Button (Rounded Red) */}
                                <button
                                  type="button"
                                  onClick={() => handleInitiateRemoveForm(f.key, f.title)}
                                  title={`Remove ${f.title}`}
                                  className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-200 text-white hover:text-red-600 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed mb-4">{f.desc}</p>

                            <div className="mb-4">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Form Input Fields ({fieldsList.length}):
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {fieldsList.map((field) => (
                                  <span key={field.id} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60 flex items-center gap-1">
                                    <span>{field.label}</span>
                                    {field.required && <span className="text-red-500 font-bold">*</span>}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cfg.enabled ?? true
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-[#DB9E30] bg-amber-50 border-[#DB9E30]/30'
                              }`}>
                              ● {cfg.enabled ?? true ? 'Active on Frontend' : 'Disabled (Blurred Overlay)'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingFormKey(isEditingThisForm ? null : f.key)}
                              className="text-xs font-extrabold text-[#004B39] hover:underline cursor-pointer bg-transparent border-none"
                            >
                              {isEditingThisForm ? 'Close Field Manager ✕' : 'Manage Fields & UI →'}
                            </button>
                          </div>

                          {/* Inline Field Inputs & Real-Time Form UI Manager (Wrapped inside clean inner container) */}
                          {isEditingThisForm && (
                            <div className="mt-5 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#DB9E30]/40 shadow-sm flex flex-col gap-5 animate-in fade-in">
                              {/* Header Banner */}
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 text-sm shadow-2xs font-bold">
                                    ⚙️
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-extrabold text-slate-900 m-0 uppercase tracking-wider">
                                      MANAGE INPUT FIELDS FOR {f.title}
                                    </h5>
                                    <p className="text-[11px] text-slate-500 m-0 mt-0.5">Reorder fields, add new inputs, or change field labels.</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newField = {
                                      id: Date.now().toString(),
                                      label: 'New Field Input',
                                      type: 'text',
                                      placeholder: 'Enter details...',
                                      required: false,
                                    };
                                    setFormFieldsState((prev) => ({
                                      ...prev,
                                      [f.key]: [...(prev[f.key] || []), newField],
                                    }));
                                  }}
                                  className="bg-[#004B39] hover:bg-[#00382B] text-white px-4 py-2 rounded-xl text-xs font-extrabold border-none cursor-pointer flex items-center gap-1.5 shadow-xs transition-all hover:shadow-md shrink-0"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Add Field Input
                                </button>
                              </div>

                              {/* Clean Row-by-Row Field Inputs List */}
                              <div className="flex flex-col gap-3">
                                {fieldsList.map((field, idx) => (
                                  <div
                                    key={field.id}
                                    className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 overflow-hidden w-full"
                                  >
                                    {/* Left Controls: Move arrows + Label + Type dropdown */}
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                      {/* Move Up/Down Controls */}
                                      <div className="flex flex-col gap-0.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80 shrink-0">
                                        <button
                                          type="button"
                                          disabled={idx === 0}
                                          onClick={() => {
                                            if (idx === 0) return;
                                            const updated = [...fieldsList];
                                            const temp = updated[idx - 1];
                                            updated[idx - 1] = updated[idx];
                                            updated[idx] = temp;
                                            setFormFieldsState((prev) => ({ ...prev, [f.key]: updated }));
                                          }}
                                          className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-20 border-none cursor-pointer transition-colors"
                                          title="Move Up"
                                        >
                                          <MoveUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={idx === fieldsList.length - 1}
                                          onClick={() => {
                                            if (idx === fieldsList.length - 1) return;
                                            const updated = [...fieldsList];
                                            const temp = updated[idx + 1];
                                            updated[idx + 1] = updated[idx];
                                            updated[idx] = temp;
                                            setFormFieldsState((prev) => ({ ...prev, [f.key]: updated }));
                                          }}
                                          className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-20 border-none cursor-pointer transition-colors"
                                          title="Move Down"
                                        >
                                          <MoveDown className="w-3 h-3" />
                                        </button>
                                      </div>

                                      {/* Editable Field Label */}
                                      <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => {
                                          const updated = [...fieldsList];
                                          updated[idx].label = e.target.value;
                                          setFormFieldsState((prev) => ({ ...prev, [f.key]: updated }));
                                        }}
                                        className="flex-1 min-w-[100px] px-3.5 py-2 border border-slate-200 rounded-full text-xs font-bold text-slate-800 outline-none focus:border-[#004B39] focus:ring-2 focus:ring-[#004B39]/10 transition-all bg-slate-50/40 focus:bg-white truncate"
                                        placeholder="Field Label"
                                      />

                                      {/* Field Type Dropdown Selector */}
                                      <select
                                        value={field.type}
                                        onChange={(e) => {
                                          const updated = [...fieldsList];
                                          updated[idx].type = e.target.value;
                                          setFormFieldsState((prev) => ({ ...prev, [f.key]: updated }));
                                        }}
                                        className="px-3 py-2 border border-slate-200 rounded-full text-xs font-medium text-slate-700 bg-slate-50/50 outline-none focus:border-[#004B39] focus:bg-white cursor-pointer transition-all shrink-0 max-w-[140px]"
                                      >
                                        <option value="text">Text Input</option>
                                        <option value="email">Email Input</option>
                                        <option value="tel">Phone / Tel Input</option>
                                        <option value="select">Dropdown Select</option>
                                        <option value="textarea">Textarea</option>
                                      </select>
                                    </div>

                                    {/* Right Controls: Required Switch & Trash Icon */}
                                    <div className="flex items-center gap-3 shrink-0">
                                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/80">
                                        <span className="text-[11px] font-semibold text-slate-600">Required</span>
                                        <Switch
                                          checked={field.required}
                                          onChange={(checked: boolean) => {
                                            const updated = [...fieldsList];
                                            updated[idx].required = checked;
                                            setFormFieldsState((prev) => ({ ...prev, [f.key]: updated }));
                                          }}
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = fieldsList.filter((_, i) => i !== idx);
                                          setFormFieldsState((prev) => ({ ...prev, [f.key]: updated }));
                                        }}
                                        className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center border-none cursor-pointer transition-all shrink-0"
                                        title="Delete Field Input"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Clean Live Frontend Form UI Preview */}
                              <div className="mt-3 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col gap-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                    <span>👁</span> LIVE FRONTEND FORM PREVIEW ({f.title})
                                  </div>
                                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                    ● Live Sync
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                  {fieldsList.map((fd) => (
                                    <div key={fd.id} className={fd.type === 'textarea' ? 'sm:col-span-2' : ''}>
                                      <label className="text-xs font-extrabold text-slate-700 block mb-1">
                                        {fd.label} {fd.required && <span className="text-red-500 font-bold">*</span>}
                                      </label>
                                      {fd.type === 'textarea' ? (
                                        <textarea
                                          rows={2}
                                          readOnly
                                          placeholder={fd.placeholder || `Enter ${fd.label.toLowerCase()}...`}
                                          className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50/70 outline-none font-medium"
                                        />
                                      ) : fd.type === 'select' ? (
                                        <select disabled className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50/70 outline-none font-medium">
                                          <option>{fd.placeholder || `Select ${fd.label.toLowerCase()}...`}</option>
                                        </select>
                                      ) : (
                                        <input
                                          type={fd.type}
                                          readOnly
                                          placeholder={fd.placeholder || `Enter ${fd.label.toLowerCase()}...`}
                                          className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50/70 outline-none font-medium"
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  disabled
                                  className="w-full py-3 bg-[#004B39] text-white rounded-xl text-xs font-black tracking-wide uppercase opacity-90 cursor-not-allowed shadow-xs mt-1"
                                >
                                  {cfg.buttonText || 'Submit Inquiry'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── 2. EMAIL CONFIGS SUB-TAB (Redesigned Executive UI) ── */}
              {formsSubTab === 'emailConfigs' && (
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-2xs flex flex-col gap-6">
                    {/* Notification & Email Routing Settings Box */}
                    <div className="p-6 lg:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#004B39] border border-emerald-100 flex items-center justify-center text-xl shadow-2xs font-bold">
                            ✉️
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-wider m-0">NOTIFICATION &amp; EMAIL ROUTING SETTINGS</h4>
                            <p className="text-xs text-slate-500 mt-0.5 mb-0">Where website form submissions are delivered and how outgoing email notifications appear to recipients.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveFormsSettings}
                          disabled={savingForms}
                          className="bg-[#004B39] hover:bg-[#00382B] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer border-none shadow-md flex items-center gap-2"
                        >
                          <Save className="w-4 h-4 text-emerald-300" />
                          {savingForms ? 'Saving Email Configs...' : 'Save Email Configs'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Send To Email Address */}
                        <div className="flex flex-col gap-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <label className="font-extrabold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" /> SEND TO EMAIL ADDRESS
                            </label>
                            <span className="text-[10px] font-bold bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-full">Admin Recipient</span>
                          </div>
                          <p className="text-[11px] text-slate-500 m-0">Admin email address that receives all website form submissions.</p>
                          <input
                            type="email"
                            value={emailConfigs.sendToEmail}
                            onChange={(e) => setEmailConfigs({ ...emailConfigs, sendToEmail: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] focus:ring-2 focus:ring-[#004B39]/10 font-mono font-bold text-slate-800 shadow-2xs mt-1"
                          />
                        </div>

                        {/* Email Subject Line */}
                        <div className="flex flex-col gap-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <label className="font-extrabold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500" /> EMAIL SUBJECT LINE
                            </label>
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Smart Tags Enabled</span>
                          </div>
                          <p className="text-[11px] text-slate-500 m-0">Use [subject] or [name] as dynamic smart tags in subject.</p>
                          <input
                            type="text"
                            value={emailConfigs.emailSubjectLine}
                            onChange={(e) => setEmailConfigs({ ...emailConfigs, emailSubjectLine: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] focus:ring-2 focus:ring-[#004B39]/10 font-bold text-slate-800 shadow-2xs mt-1"
                          />
                        </div>

                        {/* From Name */}
                        <div className="flex flex-col gap-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors">
                          <label className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">FROM NAME</label>
                          <p className="text-[11px] text-slate-500 m-0">Display sender name shown to email recipients.</p>
                          <input
                            type="text"
                            value={emailConfigs.fromName}
                            onChange={(e) => setEmailConfigs({ ...emailConfigs, fromName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] focus:ring-2 focus:ring-[#004B39]/10 font-bold text-slate-800 shadow-2xs mt-1"
                          />
                        </div>

                        {/* From Email */}
                        <div className="flex flex-col gap-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors">
                          <label className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">FROM EMAIL</label>
                          <p className="text-[11px] text-slate-500 m-0">Must match authenticated sender address.</p>
                          <input
                            type="email"
                            value={emailConfigs.fromEmail}
                            onChange={(e) => setEmailConfigs({ ...emailConfigs, fromEmail: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] focus:ring-2 focus:ring-[#004B39]/10 font-mono font-bold text-slate-800 shadow-2xs mt-1"
                          />
                        </div>

                        {/* Reply-To Email */}
                        <div className="flex flex-col gap-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-colors md:col-span-2">
                          <label className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">REPLY-TO EMAIL ADDRESS</label>
                          <p className="text-[11px] text-slate-500 m-0">When admin clicks Reply in their inbox, email goes here. Leave blank to use submitter&apos;s email address.</p>
                          <input
                            type="email"
                            value={emailConfigs.replyTo}
                            onChange={(e) => setEmailConfigs({ ...emailConfigs, replyTo: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] focus:ring-2 focus:ring-[#004B39]/10 font-mono font-bold text-slate-800 shadow-2xs mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── SMTP Environment Connection (.env Configured) Card ── */}
                    <div className="p-6 lg:p-7 rounded-3xl bg-gradient-to-r from-[#071814] via-[#0E2C24] to-[#004B39] text-white border border-[#DB9E30]/30 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#DB9E30] opacity-10 rounded-full blur-3xl pointer-events-none" />

                      <div className="relative z-10 flex flex-col gap-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#DB9E30]/20 border border-[#DB9E30]/40 flex items-center justify-center text-xl shadow-xs">
                              ⚡
                            </div>
                            <div>
                              <h4 className="text-base font-extrabold text-white uppercase tracking-wider m-0 flex items-center gap-2">
                                SMTP MAIL SERVER CONNECTION (.env CONFIGURED)
                              </h4>
                              <p className="text-xs text-emerald-100/70 mt-0.5 mb-0">Real-time email dispatch engine powered securely via server environment variables.</p>
                            </div>
                          </div>

                          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> ● Active via .env File
                          </span>
                        </div>

                        {/* Active .env Configuration Parameters Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                          <div className="p-3.5 rounded-2xl bg-[#051410]/70 border border-emerald-500/20 backdrop-blur-md">
                            <span className="text-[10px] font-extrabold text-[#DB9E30] uppercase tracking-widest block mb-1">
                              SMTP SERVER HOST
                            </span>
                            <span className="text-xs font-mono font-bold text-white block truncate">
                              smtp.kingtravelcan.com
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Configured in process.env.SMTP_HOST</span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#051410]/70 border border-emerald-500/20 backdrop-blur-md">
                            <span className="text-[10px] font-extrabold text-[#DB9E30] uppercase tracking-widest block mb-1">
                              PORT &amp; ENCRYPTION
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-300 block">
                              Port 587 (STARTTLS)
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Configured in process.env.SMTP_PORT</span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#051410]/70 border border-emerald-500/20 backdrop-blur-md">
                            <span className="text-[10px] font-extrabold text-[#DB9E30] uppercase tracking-widest block mb-1">
                              AUTHENTICATED ACCOUNT
                            </span>
                            <span className="text-xs font-mono font-bold text-white block truncate">
                              no-reply@kingtravelcan.com
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Configured in process.env.SMTP_USER</span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#051410]/70 border border-emerald-500/20 backdrop-blur-md">
                            <span className="text-[10px] font-extrabold text-[#DB9E30] uppercase tracking-widest block mb-1">
                              SECURITY MODE
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-300 block">
                              🔒 Environment Protected
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Password secured in .env</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Success Message Box */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider m-0">SUCCESS MESSAGE</h4>
                        <p className="text-xs text-slate-500 mt-0.5 mb-0">Shown to the user immediately after a successful form submission.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field>
                        <FieldLabel className="font-bold text-xs text-slate-700 uppercase">SUCCESS HEADING</FieldLabel>
                        <input
                          type="text"
                          value={emailConfigs.successHeading}
                          onChange={(e) => setEmailConfigs({ ...emailConfigs, successHeading: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] font-semibold"
                        />
                      </Field>

                      <Field>
                        <FieldLabel className="font-bold text-xs text-slate-700 uppercase">SUCCESS DESCRIPTION</FieldLabel>
                        <input
                          type="text"
                          value={emailConfigs.successDescription}
                          onChange={(e) => setEmailConfigs({ ...emailConfigs, successDescription: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] font-semibold"
                        />
                      </Field>
                    </div>

                    {/* Bottom Action Save Bar for Email Configs */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                      <div>
                        {formsSaveMsg && <span className="text-xs font-bold text-emerald-600">{formsSaveMsg}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveFormsSettings}
                        disabled={savingForms}
                        className="bg-[#004B39] hover:bg-[#00382B] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border-none"
                      >
                        <Save className="w-4 h-4 text-emerald-300" />
                        {savingForms ? 'Saving Email Configs...' : 'Save Email Configs'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 3. EMAIL TEMPLATE SUB-TAB (Matching Screenshot 2: HTML Editor & Real-Time Preview) ── */}
              {formsSubTab === 'emailTemplate' && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">✉️ EMAIL TEMPLATE CONFIGURATION</h3>
                      <p className="text-xs text-slate-500 mt-0.5 mb-0">Edit HTML notification layout sent to administrators upon form submission.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const html = getResponsiveEmailTemplateHtml('Sample Form Submission', {
                          fullName: 'John Doe',
                          email: 'john.doe@example.com',
                          phone: '+1 905-624-8555',
                          packageType: 'Deluxe Hajj Package 2027',
                          departureDate: 'Flexible 2027',
                          message: 'Looking for quad occupancy options and flight schedules from Toronto.',
                        });
                        setEmailTemplateHtml(html);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      🔄 Reset to Default
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* HTML Editor Panel */}
                    <div className="bg-[#0B132B] rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col gap-3 text-white">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
                        <span>&lt;/&gt; HTML EDITOR</span>
                        <span className="text-[10px] text-emerald-400">Live Code Mode</span>
                      </div>
                      <textarea
                        rows={18}
                        value={emailTemplateHtml}
                        onChange={(e) => setEmailTemplateHtml(e.target.value)}
                        className="w-full bg-transparent font-mono text-xs text-emerald-400 outline-none resize-y leading-relaxed border-none focus:ring-0"
                      />
                    </div>

                    {/* Real-Time Preview Panel */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs flex flex-col gap-3">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                        👁 REAL-TIME PREVIEW
                      </div>
                      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 min-h-[420px] overflow-auto">
                        <iframe
                          srcDoc={emailTemplateHtml}
                          title="Email Template Preview"
                          className="w-full h-[400px] border-none rounded-xl bg-white shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. INBOX SUB-TAB (Matching Screenshot 3) ── */}
              {formsSubTab === 'inbox' && (
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-2xs flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider m-0">📩 SUBMISSION QUEUE</h4>
                      <p className="text-xs text-slate-500 mt-0.5 mb-0 font-medium">Real-time incoming lead submissions across all active forms.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" className="text-xs font-extrabold text-[#004B39] hover:underline cursor-pointer bg-transparent border-none">
                        MARK ALL READ
                      </button>
                      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                        <button type="button" className="px-3 py-1 rounded-lg bg-[#004B39] text-white border-none cursor-pointer">ALL</button>
                        <button type="button" className="px-3 py-1 rounded-lg text-slate-600 border-none bg-transparent cursor-pointer">UNREAD</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col divide-y divide-slate-100">
                    {[
                      { email: 'hassandks10@gmail.com', msg: 'Inquiry regarding 14 Days Premium Umrah Package for family of 4.', form: 'CONTACT', date: 'July 30, 2026' },
                      { email: 'mubashir.dev@gmail.com', msg: 'Interested in Saudi Tourist eVisa process for Canadian passport holder.', form: 'VISA CONSULTATION', date: 'July 29, 2026' },
                      { email: 'dks.admin@kingtravelcan.com', msg: 'Direct flight inquiry from Toronto to Madinah in December.', form: 'FLIGHT BOOKING', date: 'July 28, 2026' },
                    ].map((item, idx) => (
                      <div key={idx} className="py-4 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{item.email}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                          <p className="text-xs text-slate-600 mt-1 mb-1 font-medium">{item.msg}</p>
                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                            {item.form}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 5. SENT HISTORY SUB-TAB (Matching Screenshot 4) ── */}
              {formsSubTab === 'sentHistory' && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl text-slate-400 mb-4">
                    📥
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 m-0">No History</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-0">You haven&apos;t sent any automated replies yet.</p>
                </div>
              )}

              {/* ── 6. EMAIL LOGS SUB-TAB (Matching Screenshot 5) ── */}
              {formsSubTab === 'emailLogs' && (
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-2xs flex flex-col gap-6">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider m-0">🔄 EMAIL DELIVERY LOGS</h4>
                    <p className="text-xs text-slate-500 mt-0.5 mb-0 font-medium">Real-time tracking of form notification emails sent to administrators.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-4">DATE &amp; TIME</th>
                          <th className="py-3 px-4">FORM ID</th>
                          <th className="py-3 px-4">STATUS</th>
                          <th className="py-3 px-4">SENT TO</th>
                          <th className="py-3 px-4">DETAILS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { time: 'Jul 30, 2026 14:22', formId: 'contact-form-1', status: 'Delivered', sentTo: 'info@kingtravelcan.com', details: 'Notification sent successfully via SMTP' },
                          { time: 'Jul 29, 2026 09:15', formId: 'visa-form-2', status: 'Delivered', sentTo: 'visas@kingtravelcan.com', details: 'Notification sent successfully via SMTP' },
                        ].map((log, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-mono font-medium text-slate-600">{log.time}</td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-800">{log.formId}</td>
                            <td className="py-3 px-4">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                • {log.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-700">{log.sentTo}</td>
                            <td className="py-3 px-4 text-slate-500">{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= OTHER TABS PLACEHOLDER ================= */}
          {activeTab !== 'header-footer' && activeTab !== 'identity' && activeTab !== 'share' && activeTab !== 'users' && activeTab !== 'auth' && activeTab !== 'popup' && activeTab !== 'css' && activeTab !== 'forms' && (
            <div className="p-6 text-center text-slate-500">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {TABS.find((t) => t.id === activeTab)?.label} Configuration
              </h3>
              <p className="text-xs">Advanced settings for {activeTab} can be managed here.</p>
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal config={confirmConfig} onClose={() => setConfirmConfig(null)} />

      {/* 3D Glassmorphism Centric Notification Modal */}
      <GlassNotificationModal
        isOpen={notificationConfig.isOpen}
        type={notificationConfig.type}
        title={notificationConfig.title}
        message={notificationConfig.message}
        onClose={() => setNotificationConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </AdminLayout>
  );
}
