import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-blue-50/50 rounded-3xl p-10 md:p-16 border border-blue-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to speed up your workflow?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and creators who trust VideoFlow for their video processing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200">
              Get Started Free
            </button>
            <button className="flex items-center justify-center px-8 py-3.5 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;