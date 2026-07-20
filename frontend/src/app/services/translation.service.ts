import { Injectable, signal, computed } from '@angular/core';

export type Language = 'fr' | 'en';

const DICTIONARY = {
  fr: {
    BRAND_TITLE_1: 'Garage',
    BRAND_TITLE_2: 'Connect',
    BRAND_DESC: 'La plateforme numéro un pour la gestion transparente de vos réparations automobiles.',
    FEAT_1_TITLE: 'Garages de confiance',
    FEAT_1_DESC: 'Trouvez des garages fiables et notés par d\'autres clients.',
    FEAT_2_TITLE: 'Suivi en temps réel',
    FEAT_2_DESC: 'Suivez l\'avancement de vos réparations à chaque étape.',
    FEAT_3_TITLE: 'Paiement sécurisé',
    FEAT_3_DESC: 'Validez, payez et recevez vos rapports en toute sécurité.',
    SATISFACTION_TITLE: 'Votre satisfaction, notre priorité',
    SATISFACTION_DESC: 'GarageConnect met en relation des milliers de clients et de garages pour des réparations rapides.',
    SATISFACTION_USERS: 'Plus de 2 000 utilisateurs satisfaits',
    
    LANG_BUTTON: 'English',
    LANG_VAL: 'en',
    
    LOGIN_TITLE: 'Bon retour !',
    LOGIN_SUBTITLE: 'Veuillez entrer vos identifiants pour vous connecter.',
    LOGIN_EMAIL: 'Adresse email',
    LOGIN_EMAIL_PH: 'jean.dupont@exemple.com',
    LOGIN_PWD: 'Mot de passe',
    LOGIN_PWD_PH: '••••••••',
    LOGIN_PWD_FORGOT: 'Oublié ?',
    LOGIN_REMEMBER: 'Se souvenir de moi',
    LOGIN_BTN: 'Se connecter',
    LOGIN_BTN_LOADING: 'Connexion...',
    LOGIN_OR: 'ou',
    LOGIN_GOOGLE: 'Continuer avec Google',
    LOGIN_NEW: 'Nouveau sur la plateforme ?',
    LOGIN_CREATE_ACC: 'Créer un compte',
    
    REG_TITLE: 'Rejoignez-nous',
    REG_SUBTITLE: 'Renseignez vos informations pour démarrer.',
    REG_FIRSTNAME: 'Prénom',
    REG_FIRSTNAME_PH: 'Jean',
    REG_LASTNAME: 'Nom',
    REG_LASTNAME_PH: 'Dupont',
    REG_PHONE: 'Téléphone',
    REG_ROLE: 'Rôle',
    REG_ROLE_CLIENT: 'Client',
    REG_ROLE_GARAGE: 'Garage',
    REG_ROLE_MEC: 'Mécanicien',
    REG_PWD_HINT: 'Le mot de passe doit contenir au moins 8 caractères.',
    REG_TERMS_1: 'J\'accepte les',
    REG_TERMS_COND: 'conditions',
    REG_TERMS_AND: 'et la',
    REG_TERMS_PRIV: 'confidentialité',
    REG_BTN: 'S\'inscrire',
    REG_BTN_LOADING: 'Création en cours...',
    REG_GOOGLE: 'S\'inscrire avec Google',
    REG_ALREADY: 'Vous avez déjà un compte ?',
    REG_LOGIN_LINK: 'Se connecter',

    ERR_INVALID: 'Identifiants invalides ou erreur serveur.',
    ERR_GOOGLE: 'Erreur lors de la connexion Google.',
    SUCC_LOGIN: 'Connexion réussie ! Redirection...',
    SUCC_REG: 'Inscription réussie ! Redirection...',
    SUCC_GOOGLE: 'Connexion Google réussie ! Redirection...',
    SUCC_GOOGLE_REG: 'Inscription Google réussie ! Redirection...'
  },
  en: {
    BRAND_TITLE_1: 'Garage',
    BRAND_TITLE_2: 'Connect',
    BRAND_DESC: 'The number one platform for transparent management of your auto repairs.',
    FEAT_1_TITLE: 'Trusted Garages',
    FEAT_1_DESC: 'Find reliable garages rated by other customers.',
    FEAT_2_TITLE: 'Real-time Tracking',
    FEAT_2_DESC: 'Follow the progress of your repairs at every step.',
    FEAT_3_TITLE: 'Secure Payment',
    FEAT_3_DESC: 'Validate, pay, and receive your reports safely.',
    SATISFACTION_TITLE: 'Your satisfaction, our priority',
    SATISFACTION_DESC: 'GarageConnect connects thousands of clients and garages for fast repairs.',
    SATISFACTION_USERS: 'Over 2,000 satisfied users',
    
    LANG_BUTTON: 'Français',
    LANG_VAL: 'fr',
    
    LOGIN_TITLE: 'Welcome back!',
    LOGIN_SUBTITLE: 'Please enter your credentials to log in.',
    LOGIN_EMAIL: 'Email Address',
    LOGIN_EMAIL_PH: 'john.doe@example.com',
    LOGIN_PWD: 'Password',
    LOGIN_PWD_PH: '••••••••',
    LOGIN_PWD_FORGOT: 'Forgot?',
    LOGIN_REMEMBER: 'Remember me',
    LOGIN_BTN: 'Sign in',
    LOGIN_BTN_LOADING: 'Signing in...',
    LOGIN_OR: 'or',
    LOGIN_GOOGLE: 'Continue with Google',
    LOGIN_NEW: 'New to the platform?',
    LOGIN_CREATE_ACC: 'Create an account',
    
    REG_TITLE: 'Join us',
    REG_SUBTITLE: 'Fill in your details to get started.',
    REG_FIRSTNAME: 'First Name',
    REG_FIRSTNAME_PH: 'John',
    REG_LASTNAME: 'Last Name',
    REG_LASTNAME_PH: 'Doe',
    REG_PHONE: 'Phone',
    REG_ROLE: 'Role',
    REG_ROLE_CLIENT: 'Client',
    REG_ROLE_GARAGE: 'Garage',
    REG_ROLE_MEC: 'Mechanic',
    REG_PWD_HINT: 'Password must be at least 8 characters.',
    REG_TERMS_1: 'I accept the',
    REG_TERMS_COND: 'terms',
    REG_TERMS_AND: 'and',
    REG_TERMS_PRIV: 'privacy policy',
    REG_BTN: 'Sign up',
    REG_BTN_LOADING: 'Creating account...',
    REG_GOOGLE: 'Sign up with Google',
    REG_ALREADY: 'Already have an account?',
    REG_LOGIN_LINK: 'Log in',

    ERR_INVALID: 'Invalid credentials or server error.',
    ERR_GOOGLE: 'Error during Google login.',
    SUCC_LOGIN: 'Login successful! Redirecting...',
    SUCC_REG: 'Registration successful! Redirecting...',
    SUCC_GOOGLE: 'Google login successful! Redirecting...',
    SUCC_GOOGLE_REG: 'Google registration successful! Redirecting...'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = signal<Language>('fr');

  constructor() {
    const savedLang = localStorage.getItem('app-lang') as Language;
    if (savedLang === 'fr' || savedLang === 'en') {
      this.currentLang.set(savedLang);
    }
  }

  // Computed signal to always have the right dictionary
  t = computed(() => DICTIONARY[this.currentLang()]);

  toggleLanguage() {
    const newLang = this.currentLang() === 'fr' ? 'en' : 'fr';
    this.currentLang.set(newLang);
    localStorage.setItem('app-lang', newLang);
  }

  getCurrentLang() {
    return this.currentLang();
  }
}
