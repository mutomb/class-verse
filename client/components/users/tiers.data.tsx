export interface TiersData{
  title: string,
  subheader?: 'Recommended',
  price: {
    course: string,
    consult_course?: string,
    consult_upskill?: string,
    specialist: string
  },
  client: {main: string, detail?: string}[],
  specialist: {main: string, detail?: string}[],
  buttonText: string,
  buttonVariant: 'contained' | 'outlined',
  quantity: number,
}
export const tiers: TiersData[] = [
  {
    title: 'Free',
    price: {
      course: '0',
      specialist: '0'
    },
    client: [
      {main: 'Life-time client account.', detail: ''},
      {main: 'Browser verified and certified courses.', detail: ''},
      {main: 'Access free courses and 1-3 free lessons of paid courses.', detail: ''},
      {main: 'Browse and contact specialist directly.', detail: ''},
      {main: 'Help center access.', detail: ''},
      {main: 'Receive promotion updates.', detail: ''},
    ],
    specialist: [
      {main: 'Life-time specialist profile.', detail: ''},
      {main: 'Link free course content stored on Google Drive or Youtube.', detail: 'Free courses are recommended for introductory courses, to captivate the interest of beginners and draw them to more intermediate or advanced paid courses. Beginner courses do not need to be securely hosted on our platform as they are usually easy to find publically online. This is just a recommendation not a rule.'},
      {main: 'Help center access.', detail: ''},
      ],
    buttonText: 'Get started',
    buttonVariant: 'outlined',
    quantity: 0
  },
  {
    title: 'Study',
    subheader: 'Recommended',
    price: {
      course: '1-10',
      consult_course: '0',
      consult_upskill: '10',
      specialist: '10'
    },
    client: [
        {main: 'All free plans features and more...'},  
        {main: 'Purchase verified and certified courses.', detail: 'All our courses do not exceed more than $10/course and, are verified and provide a certificate of completion once successfully completed (including an exam).'},
        {main: 'Unlimited course-based consultation.', detail: 'Each course that you have purchased comes along with free online consultations with the specialist of that specific course via our messaging and/or video chatting functionality (no installation needed), where you can only ask them questions about the course'},
        {main: 'Find nearby or virtual specialists.', detail: 'You can also connect with a specialist without buying a course, where you can engage with them to upskill yourself or to solve problems based on their skills. The price you pay to us or to them is only a fee per hour of consulation. The fee does not exceed $10/hour of non-group consultation.'},
        {main: 'Payment security.', detail: 'You can make consultation payment into our "trust account", so we can refund you in case of unsuccessful consultation and if we fail to get you another specialist'},
        {main: 'Prioritized help center access.', detail: 'We will respond to your general queries blazingly fast during pur working hours (Mon-Fri CAT, 10AM-5PM)'},
      ],
    specialist: [
        {main: 'All free plans features and more...'},
        {main: 'We do not take commission on your sales.', detail: 'The price you pay is only the small monthly fee for hosting your content, based on your storage needs, or for electronic fund transfer charges'},
        {main: '20GB storage space.', detail: 'The default storage space allocated for your hosting is 20Gb, but we can augment it upon request at an extra fee of $5 per 10Gb'},
        {main: 'Secure storage space.', detail: 'Your published course content will be read-only and accessible exclusively to a client who has paid for it'},
        {main: 'Prioritized on our search engine.', detail: 'When a client searches for courses or specialists, your profile and course(s) will be placed before those who have not renewed have not paid'},
        {main: 'Discount promotion.', detail: 'Your discount will be promoted on our discount section and via mailist for the duration of promotion (1-2 weeks).'},
        {main: 'Trust account option.', detail: 'Clients may pay you directly or may choose to pay into our trust account (for security reason). The later needs a 5% fee to be charged on the total payment for maintainance of our trust account or/and dispute resolution'},
        {main: 'Prioritized help center access.', detail: 'We will respond to your general queries blazingly fast during our working hours (10AM-5PM CAT, Mon-Fri)'},
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
    quantity: 0
  },
  {
    title: 'Upskill',
    price: {
      course: '1-10',
      consult_course: '0',
      consult_upskill: '90',
      specialist: '10'
    },
    client: [
      {main: 'All pro tier features and more...', detail: ''},
      {main: "Upskilling consultant.", detail: "We provide you a consultant who can train 1 to 10 people (such as company) to upskill them on a specific technology of your choice, through a training programme tailored to according to your needs. The price you pay is only a fee per hour of training. As multiple consultation hours are usually required for proper training, this package offers 10 hours of consultation at a 10% price discount."},
    ],
    specialist: [
      {main: 'All pro tier price applicable.', detail: ''},
    ],
    buttonText: 'Get started',
    buttonVariant: 'outlined',
    quantity: 10
  },
];