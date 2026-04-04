export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  avatarInitials: string;
  avatarColor: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Tenant",
    location: "Whitefield, Bangalore",
    content:
      "UrbanKey made finding my first rental apartment incredibly easy. The AI search helped me find exactly what I was looking for, and the zero brokerage saved me ₹25,000!",
    rating: 5,
    avatarInitials: "RS",
    avatarColor: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Tenant",
    location: "Indiranagar, Bangalore",
    content:
      "The digital rent agreement feature is a game-changer. Everything was done online, and the landlord verification gave me peace of mind. Highly recommend UrbanKey!",
    rating: 5,
    avatarInitials: "PS",
    avatarColor: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "Landlord",
    location: "Koramangala, Bangalore",
    content:
      "As a landlord, I've listed 3 properties on UrbanKey. The leads are high-quality and verified. The WhatsApp integration makes communication seamless.",
    rating: 5,
    avatarInitials: "AK",
    avatarColor: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    name: "Neha Gupta",
    role: "Tenant",
    location: "HSR Layout, Bangalore",
    content:
      "Found my dream 2BHK within a week! The metro distance filter was super helpful. The landlord was verified and the whole process was smooth.",
    rating: 5,
    avatarInitials: "NG",
    avatarColor: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    name: "Vikram Mehta",
    role: "Landlord",
    location: "Electronic City, Bangalore",
    content:
      "Zero brokerage, verified tenants, and instant communication. UrbanKey has transformed how I rent out my properties. Best decision ever!",
    rating: 5,
    avatarInitials: "VM",
    avatarColor: "from-indigo-500 to-purple-500",
  },
];
