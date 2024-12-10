import React, { useState } from 'react';

const TailwindClassShowcase = () => {
  const [activeSection, setActiveSection] = useState(null);

  // Layout and Positioning Examples
  const LayoutSection = () => (
    <div className="p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Layout and Positioning</h2>
      
      {/* Display Classes */}
      <div>
        <div className="flex bg-blue-100 p-2 mb-2">
          <div className="flex-1 bg-blue-200 p-2 mr-2">Flex Container</div>
          <div className="flex-1 bg-blue-200 p-2">Another Flex Item</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 bg-green-100 p-2">
          <div className="bg-green-200 p-2">Grid Column 1</div>
          <div className="bg-green-200 p-2">Grid Column 2</div>
          <div className="bg-green-200 p-2">Grid Column 3</div>
        </div>
        
        <div className="inline-block bg-purple-200 p-2 mr-2">Inline Block</div>
        <div className="block bg-purple-300 p-2">Block Element</div>
      </div>
    </div>
  );

  // Spacing Examples
  const SpacingSection = () => (
    <div className="p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Spacing</h2>
      
      <div className="flex">
        {/* Margin Examples */}
        <div className="m-2 p-2 bg-red-200 mr-4">Margin All Sides</div>
        <div className="mt-4 mb-4 p-2 bg-red-300">Top & Bottom Margin</div>
      </div>
      
      {/* Padding Examples */}
      <div className="flex">
        <div className="p-4 bg-green-200 mr-2">Padding All Sides</div>
        <div className="pt-2 pb-2 pl-4 pr-4 bg-green-300">Specific Padding</div>
      </div>
    </div>
  );

  // Typography Examples
  const TypographySection = () => (
    <div className="p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Typography</h2>
      
      <div className="space-y-2">
        <p className="text-xs bg-blue-100 p-2">Extra Small Text</p>
        <p className="text-sm bg-blue-200 p-2">Small Text</p>
        <p className="text-base bg-blue-300 p-2">Base Text</p>
        <p className="text-lg bg-blue-400 p-2">Large Text</p>
        <p className="text-xl bg-blue-500 p-2 text-white">Extra Large Text</p>
        
        <div className="flex justify-between">
          <p className="text-left bg-green-200 p-2 w-1/3">Left Aligned</p>
          <p className="text-center bg-green-300 p-2 w-1/3">Center Aligned</p>
          <p className="text-right bg-green-400 p-2 w-1/3">Right Aligned</p>
        </div>
        
        <div className="flex">
          <p className="font-thin bg-purple-200 p-2 mr-2">Thin Text</p>
          <p className="font-normal bg-purple-300 p-2 mr-2">Normal Text</p>
          <p className="font-bold bg-purple-400 p-2">Bold Text</p>
        </div>
        
        <div className="flex">
          <p className="text-blue-500 bg-blue-100 p-2 mr-2">Blue Text</p>
          <p className="text-white bg-black p-2 mr-2">White Text</p>
          <p className="text-black bg-white p-2 border">Black Text</p>
        </div>
      </div>
    </div>
  );

  // Background and Color Examples
  const BackgroundSection = () => (
    <div className="p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Background and Color</h2>
      
      <div className="flex space-x-2">
        <div className="bg-blue-500 text-white p-4">Solid Blue</div>
        <div className="bg-transparent border border-blue-500 p-4">Transparent</div>
        <div className="bg-white border p-4">White Background</div>
        <div className="bg-black text-white p-4">Black Background</div>
      </div>
    </div>
  );

  // Sizing Examples
  const SizingSection = () => (
    <div className="p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Sizing</h2>
      
      <div className="space-y-2">
        <div className="w-full bg-green-200 p-2">Full Width</div>
        <div className="w-1/2 bg-green-300 p-2">Half Width</div>
        <div className="w-1/3 bg-green-400 p-2">One-Third Width</div>
        
        <div className="flex space-x-2">
          <div className="h-24 w-24 bg-red-300">Fixed Height/Width</div>
          <div className="h-full w-full bg-red-400 p-2">Full Height/Width</div>
        </div>
      </div>
    </div>
  );

  // Borders Examples
  const BorderSection = () => (
    <div className="p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Borders</h2>
      
      <div className="flex space-x-2">
        <div className="border p-4 border-blue-500">Default Border</div>
        <div className="border-2 p-4 border-green-500">Thick Border</div>
        <div className="rounded p-4 bg-purple-200">Rounded Corners</div>
        <div className="rounded-full w-24 h-24 bg-red-300"></div>
      </div>
    </div>
  );

  // Responsive Design Example
  const ResponsiveSection = () => (
    <div className="p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Responsive Design</h2>
      
      <div className="
        flex 
        flex-col 
        sm:flex-row 
        space-y-2 
        sm:space-y-0 
        sm:space-x-2
      ">
        <div className="w-full sm:w-1/2 bg-blue-200 p-4">
          Full Width on Mobile
        </div>
        <div className="w-full sm:w-1/2 bg-blue-300 p-4">
          Half Width on Larger Screens
        </div>
      </div>
    </div>
  );

  // Hover and State Examples
  const HoverStateSection = () => (
    <div className="p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Hover and State</h2>
      
      <button className="
        bg-blue-500 
        text-white 
        p-2 
        rounded 
        hover:bg-blue-600 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-400 
        active:bg-blue-700
      ">
        Interactive Button
      </button>
    </div>
  );

  // Opacity and Z-Index Examples
  const OpacityZIndexSection = () => (
    <div className="p-4 mb-4 bg-gray-100 relative">
      <h2 className="text-xl font-bold mb-2">Opacity and Z-Index</h2>
      
      <div className="flex space-x-2">
        <div className="opacity-50 bg-green-300 p-4">50% Opacity</div>
        <div className="opacity-25 bg-green-400 p-4">25% Opacity</div>
      </div>
      
      <div className="relative mt-4">
        <div className="absolute z-10 bg-red-300 p-4">Z-Index 10</div>
        <div className="absolute z-0 bg-red-200 p-4 ml-4 mt-4">Z-Index 0</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tailwind CSS Class Showcase</h1>
      
      <div className="space-y-4">
        <LayoutSection />
        <SpacingSection />
        <TypographySection />
        <BackgroundSection />
        <SizingSection />
        <BorderSection />
        <ResponsiveSection />
        <HoverStateSection />
        <OpacityZIndexSection />
      </div>
    </div>
  );
};

export default TailwindClassShowcase;