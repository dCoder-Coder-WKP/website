import { Extra, Pizza, Topping } from '@/types';

export const TOPPINGS: Topping[] = [
  { id: 't_cheese', name: 'Cheese', category: 'Cheese', prices: { small: 40, medium: 60, large: 80 }, mesh: 'chunk', color: '#F5E6A3' },
  { id: 't_onion', name: 'Onion', category: 'Vegetable', prices: { small: 20, medium: 30, large: 40 }, mesh: 'sliver', color: '#E8CAE4' },
  { id: 't_capsicum', name: 'Capsicum', category: 'Vegetable', prices: { small: 20, medium: 30, large: 40 }, mesh: 'sliver', color: '#2D8A1F' },
  { id: 't_mushroom', name: 'Mushroom', category: 'Vegetable', prices: { small: 20, medium: 30, large: 40 }, mesh: 'sliver', color: '#9B8572' },
  { id: 't_sweetcorn', name: 'Sweetcorn', category: 'Vegetable', prices: { small: 20, medium: 30, large: 40 }, mesh: 'sphere', color: '#F7CB15' },
  { id: 't_redpepper', name: 'Red Pepper', category: 'Vegetable', prices: { small: 40, medium: 50, large: 70 }, mesh: 'sliver', color: '#E8220A' },
  { id: 't_olives', name: 'Black Olives', category: 'Vegetable', prices: { small: 40, medium: 50, large: 70 }, mesh: 'sphere', color: '#1A1817' },
  { id: 't_jalapenos', name: 'Jalapenos', category: 'Vegetable', prices: { small: 40, medium: 50, large: 70 }, mesh: 'sliver', color: '#446626' },
  { id: 't_paneer', name: 'Paneer', category: 'Cheese', prices: { small: 40, medium: 50, large: 70 }, mesh: 'chunk', color: '#FDFCF0' },
  { id: 't_chicken', name: 'Chicken', category: 'Meat', prices: { small: 50, medium: 70, large: 100 }, mesh: 'disc', color: '#D9986A' },
  { id: 't_basil', name: 'Fresh Basil', category: 'Vegetable', prices: { small: 0, medium: 0, large: 0 }, mesh: 'disc', color: '#2D5A1B' },
];

export const PIZZAS: Pizza[] = [
  {
    id: 'p_1',
    name: 'Margarita',
    description: 'Mozzarella, Cheddar, fresh Basil',
    toppings: ['t_cheese', 't_basil'],
    prices: { small: 130, medium: 230, large: 350 },
    image: '/images/menu/margarita.jpg',
    dietary: 'veg'
  },
  {
    id: 'p_2',
    name: 'Veg Delight Pizza',
    description: 'Onion, Capsicum, Sweetcorn',
    toppings: ['t_onion', 't_capsicum', 't_sweetcorn'],
    prices: { small: 250, medium: 320, large: 460 },
    image: '/images/menu/veg-delight-pizza.jpg',
    dietary: 'veg'
  },
  {
    id: 'p_3',
    name: 'Farm Fresh Pizza',
    description: 'Onion, Capsicum, Mushroom, Sweetcorn',
    toppings: ['t_onion', 't_capsicum', 't_mushroom', 't_sweetcorn'],
    prices: { small: 270, medium: 340, large: 490 },
    image: '/images/menu/farm-fresh-pizza.jpg',
    dietary: 'veg'
  },
  {
    id: 'p_4',
    name: 'Mushroom Garlic Twist',
    description: 'Garlic Tossed Mushroom, Onion, Black Olives',
    toppings: ['t_mushroom', 't_onion', 't_olives'],
    prices: { small: 270, medium: 340, large: 490 },
    image: '/images/menu/mushroom-garlic-twist.jpg',
    dietary: 'veg'
  },
  {
    id: 'p_5',
    name: 'Tangy Veg Pizza',
    description: 'Onion, Capsicum, Jalapeno, Red Pepper',
    toppings: ['t_onion', 't_capsicum', 't_jalapenos', 't_redpepper'],
    prices: { small: 290, medium: 360, large: 510 },
    image: '/images/menu/tangy-veg-pizza.jpg',
    dietary: 'veg'
  },
  {
    id: 'p_6',
    name: 'Paneer Tikka Pizza',
    description: 'Paneer Tikka, Onion, Capsicum',
    toppings: ['t_paneer', 't_onion', 't_capsicum'],
    prices: { small: 330, medium: 390, large: 560 },
    image: '/images/menu/paneer-tikka-pizza.jpg',
    dietary: 'veg'
  },
  {
    id: 'p_7',
    name: 'Veg Extravaganza Pizza',
    description: 'Herbed Onion, Capsicum, Mushroom, Corn, Black Olives, Grilled Paneer',
    toppings: ['t_onion', 't_capsicum', 't_mushroom', 't_sweetcorn', 't_olives', 't_paneer'],
    prices: { small: 350, medium: 450, large: 640 },
    image: '/images/menu/veg-extravaganza-pizza.jpg',
    dietary: 'veg'
  },
  {
    id: 'p_8',
    name: 'Paneer Makhani Pizza',
    description: 'Grilled Paneer, Onion, Makhani Gravy',
    toppings: ['t_paneer', 't_onion'],
    prices: { small: 340, medium: 400, large: 560 },
    image: '/images/menu/paneer-makhani-pizza.jpg',
    dietary: 'veg'
  },
  {
    id: 'p_9',
    name: 'Roasted Chicken Pizza',
    description: 'Roast Chicken, Onion, Sweetcorn',
    toppings: ['t_chicken', 't_onion', 't_sweetcorn'],
    prices: { small: 310, medium: 390, large: 540 },
    image: '/images/menu/roasted-chicken-pizza.jpg',
    dietary: 'non-veg'
  },
  {
    id: 'p_10',
    name: 'Tandoori Chicken Pizza',
    description: 'Tandoori Chicken, Onion, Capsicum, Mushroom',
    toppings: ['t_chicken', 't_onion', 't_capsicum', 't_mushroom'],
    prices: { small: 330, medium: 420, large: 580 },
    image: '/images/menu/tandoori-chicken-pizza.jpg',
    dietary: 'non-veg'
  },
  {
    id: 'p_11',
    name: 'BBQ Chicken Pizza',
    description: 'BBQ Chicken, Onion, Capsicum, Sweetcorn',
    toppings: ['t_chicken', 't_onion', 't_capsicum', 't_sweetcorn'],
    prices: { small: 330, medium: 420, large: 580 },
    image: '/images/menu/bbq-chicken-pizza.jpg',
    dietary: 'non-veg'
  },
  {
    id: 'p_12',
    name: 'Chicken Sausage Pizza',
    description: 'Sliced Chicken Sausage, Onion, Capsicum',
    toppings: ['t_chicken', 't_onion', 't_capsicum'],
    prices: { small: 370, medium: 420, large: 610 },
    image: '/images/menu/chicken-sausage-pizza.jpg',
    dietary: 'non-veg'
  },
  {
    id: 'p_13',
    name: 'Chicken Makhani Pizza',
    description: 'Tandoored Chicken, Onion, Makhani Gravy',
    toppings: ['t_chicken', 't_onion'],
    prices: { small: 330, medium: 440, large: 640 },
    image: '/images/menu/chicken-makhani-pizza.jpg',
    dietary: 'non-veg'
  },
  {
    id: 'p_14',
    name: 'Chicken Bacon Pizza',
    description: 'Chicken Bacon, Sliced Black Olives, Onion',
    toppings: ['t_chicken', 't_olives', 't_onion'],
    prices: { small: 370, medium: 420, large: 610 },
    image: '/images/menu/chicken-bacon-pizza.jpg',
    dietary: 'non-veg'
  },
  {
    id: 'p_15',
    name: 'Chicken Peri Peri Pizza',
    description: 'Peri Peri Chicken, Onion, Red Pepper, Jalapenos',
    toppings: ['t_chicken', 't_onion', 't_redpepper', 't_jalapenos'],
    prices: { small: 340, medium: 460, large: 640 },
    image: '/images/menu/chicken-peri-peri-pizza.jpg',
    dietary: 'non-veg'
  },
  {
    id: 'p_16',
    name: 'Spicy Chicken Tikka Pizza',
    description: 'Tandoori Chicken, Onion, Red Pepper',
    toppings: ['t_chicken', 't_onion', 't_redpepper'],
    prices: { small: 310, medium: 420, large: 580 },
    image: '/images/menu/spicy-chicken-tikka-pizza.jpg',
    dietary: 'non-veg'
  },
  {
    id: 'p_17',
    name: 'Chicken Garlic Twist',
    description: 'Garlic Chicken, Onion, Sliced Black Olives',
    toppings: ['t_chicken', 't_onion', 't_olives'],
    prices: { small: 330, medium: 400, large: 550 },
    image: '/images/menu/chicken-garlic-twist.jpg',
    dietary: 'non-veg'
  },
];

export const EXTRAS: Extra[] = [
  { id: 'e_1', name: 'Garlic Bread Sticks', category: 'starter', price: 70, dietary: 'veg', image: '/images/menu/garlic-bread-sticks.jpg' },
  { id: 'e_2', name: 'Cheesy Garlic Bread', category: 'starter', price: 150, dietary: 'veg', image: '/images/menu/cheesy-garlic-bread.jpg' },
  { id: 'e_3', name: 'Chicken Kheema Calzone', category: 'starter', price: 300, dietary: 'non-veg', image: '/images/menu/chicken-kheema-calzone.jpg' },
  { id: 'e_4', name: 'Rich Chocolate Brownie', category: 'dessert', price: 90, dietary: 'non-veg', image: '/images/menu/rich-chocolate-brownie.jpg' },
];
