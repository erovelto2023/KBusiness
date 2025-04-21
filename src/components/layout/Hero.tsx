
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative pt-16 pb-32 flex flex-col items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 w-72 h-72 bg-affiliate-purple/5 rounded-full -mr-24 -mt-24 z-0"></div>
      <div className="absolute left-0 bottom-0 w-72 h-72 bg-affiliate-purple/5 rounded-full -ml-24 -mb-24 z-0"></div>
      
      <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-affiliate-purple to-indigo-600">
            Maximize Your Affiliate Marketing Success
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Track, manage, and optimize all your affiliate programs in one powerful platform. Gain valuable insights and boost your earnings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-affiliate-purple hover:bg-affiliate-purple/90 text-lg px-8"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </Button>
            
            <Button 
              className="text-lg px-8"
              size="lg"
              variant="outline"
              onClick={() => navigate('/programs')}
            >
              Explore Programs
            </Button>
          </div>
          
          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>100+ affiliate programs</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Real-time tracking</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Advanced analytics</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="w-full bg-white py-12 border-t border-b border-gray-100 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-affiliate-purple mb-2">$2.1M+</div>
              <div className="text-gray-600">Commission earned by our users</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-affiliate-purple mb-2">15,000+</div>
              <div className="text-gray-600">Active affiliates on the platform</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-affiliate-purple mb-2">98%</div>
              <div className="text-gray-600">Customer satisfaction rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
