'use client';

export default function WhyChooseUs() {
  const reasons = [
    {
      title: 'Innovative Technology',
      description: 'We stay ahead of the curve with cutting-edge solutions and latest industry standards.',
    },
    {
      title: 'Expert Team',
      description: 'Our team of experienced engineers brings decades of expertise to every project.',
    },
    {
      title: 'Quality Assurance',
      description: 'Every component undergoes rigorous testing to ensure maximum reliability and performance.',
    },
    {
      title: 'Cost Effective',
      description: 'Competitive pricing without compromising on quality or innovation.',
    },
    {
      title: 'Fast Delivery',
      description: 'Quick turnaround times with efficient manufacturing and delivery processes.',
    },
    {
      title: 'Customer Support',
      description: 'Dedicated support team available to assist you throughout your project lifecycle.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">Us</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to delivering excellence in every aspect of our electronics solutions
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="p-6 border-l-4 border-blue-600 hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}
