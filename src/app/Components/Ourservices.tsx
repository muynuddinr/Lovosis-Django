'use client';

export default function OurServices() {
  const services = [
    {
      title: 'PCB Design & Manufacturing',
      description: 'Custom printed circuit board design and manufacturing with precision engineering and quality control.',
    },
    {
      title: 'Component Assembly',
      description: 'Professional assembly services with automated and manual techniques for complex electronic components.',
    },
    {
      title: 'Product Development',
      description: 'End-to-end product development from concept to market-ready solutions with rapid prototyping.',
    },
    {
      title: 'Testing & Quality Assurance',
      description: 'Comprehensive testing and validation services to ensure product reliability and performance.',
    },
    {
      title: 'Technical Consulting',
      description: 'Expert consulting services to optimize your electronics projects and overcome technical challenges.',
    },
    {
      title: 'Custom Solutions',
      description: 'Tailored electronics solutions designed specifically for your unique business requirements.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive electronics solutions tailored to meet your business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-semibold text-sm">
                  {index + 1}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300">
            Contact Us Today
          </button>
        </div>
      </div>
    </section>
  );
}
