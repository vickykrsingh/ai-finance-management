import {
    BarChart3,
    Receipt,
    PieChart,
    CreditCard,
    Globe,
    Zap,
  } from "lucide-react";
  
  // Stats Data
  export const statsData = [
    {
      value: "100K+",
      label: "Satisfied Users",
    },
    {
      value: "$5B+",
      label: "Funds Managed",
    },
    {
      value: "99.99%",
      label: "System Reliability",
    },
    {
      value: "4.8/5",
      label: "Customer Satisfaction",
    },
  ];
  
  
  // Features Data
  export const featuresData = [
    {
      icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
      title: "AI-Driven Analytics",
      description: "Unlock smarter financial decisions with AI-powered insights and detailed data visualizations.",
    },
    {
      icon: <Receipt className="h-8 w-8 text-emerald-600" />,
      title: "Automated Receipt Parsing",
      description: "Transform paper receipts into actionable data effortlessly with cutting-edge AI technology.",
    },
    {
      icon: <PieChart className="h-8 w-8 text-emerald-600" />,
      title: "Intelligent Budgeting",
      description: "Plan and track your budgets with personalized, AI-driven suggestions tailored to your needs.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-emerald-600" />,
      title: "Unified Account Management",
      description: "Seamlessly manage all your bank accounts and credit cards from a single dashboard.",
    },
    {
      icon: <Globe className="h-8 w-8 text-emerald-600" />,
      title: "Global Currency Support",
      description: "Handle multiple currencies effortlessly with live exchange rates and smart conversions.",
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-600" />,
      title: "Personalized Financial Insights",
      description: "Receive tailored insights and actionable recommendations to optimize your financial goals.",
    },
  ];
  
  
  // How It Works Data
  export const howItWorksData = [
    {
      icon: <CreditCard className="h-8 w-8 text-emerald-600" />,
      title: "1. Sign Up Securely",
      description: "Create your account quickly and securely to start managing your finances effortlessly.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
      title: "2. Monitor Transactions",
      description: "Track and categorize all your spending in real-time for a clear financial overview.",
    },
    {
      icon: <PieChart className="h-8 w-8 text-emerald-600" />,
      title: "3. Optimize with Insights",
      description: "Leverage AI-driven insights to enhance financial decisions and achieve your goals.",
    },
  ];
  
  
  // Testimonials Data
  export const testimonialsData = [
    {
      name: "Vicky Singh",
      role: "Project Owner",
      image: "/mine.jpg",
      quote:
        "Welth has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
    },
    {
      name: "Vipul Thakur",
      role: "Freelancer",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      quote:
        "The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.",
    },
    {
      name: "Aryaman mishra",
      role: "Freelancer",
      image: "https://randomuser.me/api/portraits/women/74.jpg",
      quote:
        "I recommend Welth to all my clients. The multi-currency support and detailed analytics make it perfect for international investors.",
    },
  ];