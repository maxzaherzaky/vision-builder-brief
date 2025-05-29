import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State to manage the current step of the brief game
  const [currentStep, setCurrentStep] = useState(0);

  // State to store all the client's brief data
  const [briefData, setBriefData] = useState({
    // Section 1: Project Overview
    clientName: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    date: new Date().toISOString().slice(0, 10), // Default to current date
    projectTitle: '',
    projectDescription: '',
    projectTypes: [], // Array to hold selected project types
    projectTypesOther: '', // For 'Other' project type specification
    decisionMakers: '', // NEW: Decision-Making Process & Key Stakeholders
    approvalProcess: '', // NEW: Decision-Making Process & Key Stakeholders

    // Section 2: Project Goals & Objectives
    problemSolved: '',
    successLookLike: '',
    kpis: '',

    // Section 3: Target Audience
    targetAudienceDescription: '',
    audienceFeelDo: '',
    audienceDemographics: {
      age: '',
      income: '',
      gender: [], // Array for multi-select
      location: '',
      interests: [], // Array for multi-select
      interestsOther: '', // For 'Other' interests
    },
    audiencePersonas: [], // Array for selected archetypes

    // Section 4: Brand Identity & Messaging
    coreBrandValues: '',
    brandPersonality: {
      modernTraditional: 50, // Slider 0-100
      playfulSerious: 50,
      luxuriousApproachable: 50,
      edgyTrustworthy: 50,
      dynamicCalm: 50,
    },
    brandToneOfVoice: [], // NEW: Brand Tone of Voice
    keyMessages: [], // Array for multiple messages
    existingAssets: '', // Text for links/notes, file upload handled separately
    assetLinks: '', // NEW: For shared asset links

    // Section 5: Specific Project Details (dynamic based on projectTypes)
    // A. Make a Logo
    logo: {
      currentLogo: '',
      desiredStyle: [],
      colors: '',
      inspirations: '',
      primaryUsage: [],
      visualElementsToInclude: '', // NEW
      visualElementsToAvoid: '',   // NEW
    },
    // B. Create a Booth
    booth: {
      eventName: '',
      datesLocation: '',
      sizeDimensions: '',
      budgetRange: '',
      keyHighlights: [],
      visitorExperience: [],
      technicalRequirements: [],
      inspirations: '',
      visualElementsToInclude: '', // NEW
      visualElementsToAvoid: '',   // NEW
    },
    // C. Imagine Event Theme & Design Event Journey/Experience
    event: {
      eventName: '',
      datesLocation: '',
      purposeObjective: '',
      estimatedAttendees: '',
      desiredMood: [],
      keyMoments: [],
      venueConsiderations: '',
      budgetRange: '',
      inspirations: '',
      visualElementsToInclude: '', // NEW
      visualElementsToAvoid: '',   // NEW
    },
    // D. Create a Layout or Main Key Visual for a Campaign
    campaign: {
      campaignNameDuration: '',
      coreMessageSlogan: '',
      channels: [],
      visualStyleMood: [],
      elementsToInclude: [],
      callToAction: '',
      inspirations: '',
      visualElementsToInclude: '', // NEW
      visualElementsToAvoid: '',   // NEW
    },

    // Section 6: Budget & Timeline
    estimatedBudget: '',
    keyDeadlines: [], // Array for multiple deadlines

    // Section 7 & 8: Competitors & Additional Notes
    mainCompetitors: [], // Array for multiple competitors
    competitorLikesDislikes: '',
    culturalSensitivities: '', // NEW: Cultural Sensitivities/Preferences
    additionalNotes: '',
  });

  // Function to handle changes in form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // --- Explicitly handle brandToneOfVoice checkbox ---
    if (name === 'brandToneOfVoice' && type === 'checkbox') {
      setBriefData(prev => ({
        ...prev,
        brandToneOfVoice: checked
          ? [...prev.brandToneOfVoice, value]
          : prev.brandToneOfVoice.filter(item => item !== value)
      }));
      return; 
    }
    // --- END Explicit Handling ---


    // Handle nested states for specific sections (e.g., logo.desiredStyle)
    if (name.includes('.')) {
      const [section, subField] = name.split('.');
      if (section === 'audienceDemographics' || section === 'brandPersonality' ||
          section === 'logo' || section === 'booth' || section === 'event' || section === 'campaign') {
        if (type === 'checkbox') {
          setBriefData(prev => ({
            ...prev,
            [section]: {
              ...prev[section],
              [subField]: checked
                ? [...prev[section][subField], value]
                : prev[section][subField].filter(item => item !== value)
            }
          }));
        } else if (type === 'range') {
          setBriefData(prev => ({
            ...prev,
            [section]: {
              ...prev[section],
              [subField]: parseInt(value, 10)
            }
          }));
        } else {
          setBriefData(prev => ({
            ...prev,
            [section]: {
              ...prev[section],
              [subField]: value
            }
          }));
        }
      }
    } else if (type === 'checkbox' && name === 'projectTypes') {
      // Handle project type checkboxes (top-level array)
      setBriefData(prev => ({
        ...prev,
        projectTypes: checked
          ? [...prev.projectTypes, value]
          : prev.projectTypes.filter(type => type !== value)
      }));
    } else if (type === 'checkbox' && (
      // General multi-select checkboxes (excluding brandToneOfVoice, handled above)
      name === 'desiredStyle' || name === 'channels' || name === 'elementsToInclude' ||
      name === 'primaryUsage' || name === 'visitorExperience' || name === 'technicalRequirements' ||
      name === 'desiredMood' || name === 'visualStyleMood'
      )) {
        const fieldName = e.target.dataset.field || name; 
        setBriefData(prev => ({
            ...prev,
            [fieldName]: checked
                ? [...prev[fieldName], value]
                : prev[fieldName].filter(item => item !== value)
        }));
    }
    else if (name === 'keyMessages' || name === 'mainCompetitors' || name === 'keyDeadlines' || name === 'keyHighlights' || name === 'keyMoments') {
        // Handle dynamically added text fields (arrays)
        const index = parseInt(e.target.dataset.index, 10);
        setBriefData(prev => {
            const newArray = [...prev[name]];
            newArray[index] = value;
            return { ...prev, [name]: newArray };
        });
    }
    else {
      // Handle top-level string/number inputs (including 'assetLinks' now)
      setBriefData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Function to add new input fields for array data (e.g., key messages)
  const addInputField = (fieldName) => {
    setBriefData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  // Function to remove input fields for array data
  const removeInputField = (fieldName, index) => {
    setBriefData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  // Function to handle form submission to Formspree
  const handleSubmitBrief = async () => {
    const formspreeEndpoint = "https://formspree.io/f/xanorjkl"; 
    
    // In Canvas, we'll simulate the submission and show an alert.
    if (formspreeEndpoint.includes("YOUR_FORM_ID")) { 
      alert("Submission simulated! Remember to replace 'YOUR_FORM_ID' for real deployments.");
      return; 
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      alert("Your creative blueprint has been submitted successfully! (This is a simulation in Canvas.)");
      console.log("Simulated brief data submitted:", briefData);
    } catch (error) {
      console.error("Submission error during simulation:", error);
      alert("An error occurred during submission simulation. (This is a simulation in Canvas.)");
    }
  };

  // Function for the "Email Us" button
  const handleEmailUs = () => {
    const recipient = "maximus.z@redbananas.com";
    const subject = "Inquiry from Vision_Builder";
    const body = "Hello,\n\nI would like to discuss a new project with you.";
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Function for Print to PDF
  const handlePrintPdf = () => {
    window.print(); // Triggers the browser's print dialog
  };


  // Array of step components
  const steps = [
    // Step 0: Welcome & Project Overview
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#ef3a4c] mb-6">Welcome, Visionary!</h2>
      <p className="text-gray-700 text-center mb-8">Your creative journey begins here. Let's craft the essence of your brand's future with Vision_Builder.</p>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">1. Project Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="clientName" className="block text-gray-700 text-sm font-bold mb-2">Client Name:</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={briefData.clientName}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
            required
          />
        </div>
        <div>
          <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={briefData.companyName}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
            required
          />
        </div>
        <div>
          <label htmlFor="contactPerson" className="block text-gray-700 text-sm font-bold mb-2">Contact Person & Title:</label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={briefData.contactPerson}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={briefData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={briefData.phone}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={briefData.date}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          />
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="projectTitle" className="block text-gray-700 text-sm font-bold mb-2">Project Title:</label>
        <input
          type="text"
          id="projectTitle"
          name="projectTitle"
          value={briefData.projectTitle}
          onChange={handleChange}
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="projectDescription" className="block text-gray-700 text-sm font-bold mb-2">Brief Project Description (in your own words):</label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          value={briefData.projectDescription}
          onChange={handleChange}
          rows="3"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          required
        ></textarea>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Project Type (Please check all that apply):</label>
        {['Make a Logo (Brand Identity)', 'Create a Booth (Exhibition/Experiential Design)', 'Imagine an Event Theme & Design the Event Journey/Experience', 'Create a Layout or Main Key Visual for a Campaign'].map(type => (
          <div key={type} className="mb-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="projectTypes"
                value={type}
                checked={briefData.projectTypes.includes(type)}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
              />
              <span className="ml-2 text-gray-700">{type}</span>
            </label>
          </div>
        ))}
        <div className="mb-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="projectTypes"
              value="Other"
              checked={briefData.projectTypes.includes('Other')}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
            />
            <span className="ml-2 text-gray-700">Other (Please specify):</span>
          </label>
          {briefData.projectTypes.includes('Other') && (
            <input
              type="text"
              name="projectTypesOther"
              value={briefData.projectTypesOther || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c] mt-2"
              placeholder="Specify other project type"
            />
          )}
        </div>
      </div>
      {/* NEW: Decision-Making Process & Key Stakeholders */}
      <div className="mb-6">
        <label htmlFor="decisionMakers" className="block text-gray-700 text-sm font-bold mb-2">Who are the primary decision-makers for this project?</label>
        <textarea
          id="decisionMakers"
          name="decisionMakers"
          value={briefData.decisionMakers}
          onChange={handleChange}
          rows="2"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="e.g., 'CEO, Marketing Director, Project Lead'"
        ></textarea>
      </div>
      <div className="mb-6">
        <label htmlFor="approvalProcess" className="block text-gray-700 text-sm font-bold mb-2">What is your typical approval process for creative work?</label>
        <textarea
          id="approvalProcess"
          name="approvalProcess"
          value={briefData.approvalProcess}
          onChange={handleChange}
          rows="2"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="e.g., 'Initial review by Marketing, final approval by CEO after one round of feedback.'"
        ></textarea>
      </div>
    </div>,

    // Step 1: Project Goals & Objectives
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#ef3a4c] mb-6">Chapter 1: Charting Your Course</h2>
      <p className="text-gray-700 text-center mb-8">Define your destination and purpose for this creative expedition.</p>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">2. Project Goals & Objectives</h3>
      <div className="mb-6">
        <label htmlFor="problemSolved" className="block text-gray-700 text-sm font-bold mb-2">What specific problem are we trying to solve with this project?</label>
        <textarea
          id="problemSolved"
          name="problemSolved"
          value={briefData.problemSolved}
          onChange={handleChange}
          rows="4"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="Example: 'Our current logo feels outdated and doesn't appeal to a younger demographic.'"
          required
        ></textarea>
      </div>
      <div className="mb-6">
        <label htmlFor="successLookLike" className="block text-gray-700 text-sm font-bold mb-2">What do you want to achieve by the end of this project? What does "success" look like?</label>
        <textarea
          id="successLookLike"
          name="successLookLike"
          value={briefData.successLookLike}
          onChange={handleChange}
          rows="4"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="Example: 'A modern, memorable logo that resonates with Gen Z.'"
          required
        ></textarea>
      </div>
      <div className="mb-6">
        <label htmlFor="kpis" className="block text-gray-700 text-sm font-bold mb-2">Are there any Key Performance Indicators (KPIs) or metrics we should be aware of?</label>
        <textarea
          id="kpis"
          name="kpis"
          value={briefData.kpis}
          onChange={handleChange}
          rows="3"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="Example: 'Increase website traffic by 15%,' 'Achieve a 5% conversion rate on the campaign.'"
        ></textarea>
      </div>
    </div>,

    // Step 2: Target Audience
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#ef3a4c] mb-6">Chapter 2: Understanding Your People</h2>
      <p className="text-gray-700 text-center mb-8">Identify the community and individuals your project aims to connect with.</p>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">3. Target Audience</h3>
      <div className="mb-6">
        <label htmlFor="targetAudienceDescription" className="block text-gray-700 text-sm font-bold mb-2">Who are we trying to reach with this project? (Please describe their demographics, interests, behaviors, and needs.)</label>
        <textarea
          id="targetAudienceDescription"
          name="targetAudienceDescription"
          value={briefData.targetAudienceDescription}
          onChange={handleChange}
          rows="4"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="Example: 'Young professionals, ages 25-35, interested in sustainable technology, early adopters.'"
          required
        ></textarea>
      </div>

      {/* Interactive Demographics */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Demographics:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="audienceDemographics.age" className="block text-gray-700 text-sm font-bold mb-2">Age Range:</label>
            <select
              id="audienceDemographics.age"
              name="audienceDemographics.age"
              value={briefData.audienceDemographics.age}
              onChange={handleChange}
              className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
            >
              <option value="">Select Age Range</option>
              <option value="Under 18">Under 18</option>
              <option value="18-24">18-24</option>
              <option value="25-35">25-35</option>
              <option value="36-50">36-50</option>
              <option value="50+">50+</option>
            </select>
          </div>
          <div>
            <label htmlFor="audienceDemographics.income" className="block text-gray-700 text-sm font-bold mb-2">Income Bracket:</label>
            <select
              id="audienceDemographics.income"
              name="audienceDemographics.income"
              value={briefData.audienceDemographics.income}
              onChange={handleChange}
              className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
            >
              <option value="">Select Income Bracket</option>
              <option value="Low">Low</option>
              <option value="Mid">Mid</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="col-span-full">
            <label className="block text-gray-700 text-sm font-bold mb-2">Gender:</label>
            {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(gender => (
              <label key={gender} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="audienceDemographics.gender"
                  value={gender}
                  checked={briefData.audienceDemographics.gender.includes(gender)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
          <div className="col-span-full">
            <label htmlFor="audienceDemographics.location" className="block text-gray-700 text-sm font-bold mb-2">Location (e.g., Riyadh, Jeddah, Eastern Province, etc.):</label>
            <input
              type="text"
              id="audienceDemographics.location"
              name="audienceDemographics.location"
              value={briefData.audienceDemographics.location}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., Riyadh, Jeddah, Eastern Province"
            />
          </div>
          <div className="col-span-full">
            <label className="block text-gray-700 text-sm font-bold mb-2">Interests/Behaviors (Select all that apply):</label>
            {['Tech Enthusiast', 'Cultural Explorer', 'Family-Oriented', 'Business Leader', 'Sustainable Living', 'Travel & Tourism', 'Arts & Culture', 'Sports & Fitness'].map(interest => (
              <label key={interest} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="audienceDemographics.interests"
                  value={interest}
                  checked={briefData.audienceDemographics.interests.includes(interest)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{interest}</span>
              </label>
            ))}
            <input
              type="text"
              name="audienceDemographics.interestsOther"
              value={briefData.audienceDemographics.interestsOther || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c] mt-2"
              placeholder="Other interests"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="audienceFeelDo" className="block text-gray-700 text-sm font-bold mb-2">What do we want this audience to *feel* or *do* after experiencing our design/campaign/event?</label>
        <textarea
          id="audienceFeelDo"
          name="audienceFeelDo"
          value={briefData.audienceFeelDo}
          onChange={handleChange}
          rows="3"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="Example: 'Feel inspired and empowered,' 'Sign up for our newsletter,' 'Make a purchase.'"
          required
        ></textarea>
      </div>
    </div>,

    // Step 3: Brand Identity & Messaging
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#ef3a4c] mb-6">Chapter 3: The Foundation of Your Essence</h2>
      <p className="text-gray-700 text-center mb-8">Build the bedrock of your brand – its values, voice, and personality.</p>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">4. Brand Identity & Messaging</h3>
      <div className="mb-6">
        <label htmlFor="coreBrandValues" className="block text-gray-700 text-sm font-bold mb-2">What are your core brand values, mission, and vision?</label>
        <textarea
          id="coreBrandValues"
          name="coreBrandValues"
          value={briefData.coreBrandValues}
          onChange={handleChange}
          rows="4"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="Example: 'Innovation, sustainability, community.'"
          required
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">How would you describe your brand's personality?</label>
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-neutral-50">
          {Object.entries(briefData.brandPersonality).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{key.replace(/([A-Z])/g, ' $1').replace('modernTraditional', 'Modern').replace('playfulSerious', 'Playful').replace('luxuriousApproachable', 'Luxurious').replace('edgyTrustworthy', 'Edgy').replace('dynamicCalm', 'Dynamic')}</span>
                <span>{key.replace(/([A-Z])/g, ' $1').replace('modernTraditional', 'Traditional').replace('playfulSerious', 'Serious').replace('luxuriousApproachable', 'Approachable').replace('edgyTrustworthy', 'Trustworthy').replace('dynamicCalm', 'Calm')}</span>
              </div>
              <input
                type="range"
                name={`brandPersonality.${key}`}
                min="0"
                max="100"
                value={value}
                onChange={handleChange}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ef3a4c]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Brand Tone of Voice */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Beyond personality, how would you describe your brand's verbal tone of voice? (Select all that apply)</label>
        {['Formal', 'Casual', 'Witty', 'Authoritative', 'Inspirational', 'Direct', 'Poetic', 'Traditional', 'Modern'].map(tone => (
          <label key={tone} className="inline-flex items-center mr-4 mb-2">
            <input
              type="checkbox"
              name="brandToneOfVoice"
              data-field="brandToneOfVoice"
              value={tone}
              checked={briefData.brandToneOfVoice.includes(tone)}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
            />
            <span className="ml-2 text-gray-700">{tone}</span>
          </label>
        ))}
        <input
          type="text"
          name="brandToneOfVoiceOther"
          value={briefData.brandToneOfVoiceOther || ''}
          onChange={handleChange}
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c] mt-2"
          placeholder="Other tone of voice"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">What are the key messages or takeaways you want to convey through this project?</label>
        {briefData.keyMessages.map((message, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              name="keyMessages"
              data-index={index}
              value={message}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c] mr-2"
              placeholder={`Message ${index + 1}`}
            />
            {briefData.keyMessages.length > 0 && (
              <button
                type="button"
                onClick={() => removeInputField('keyMessages', index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline"
                aria-label="Remove message"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addInputField('keyMessages')}
          className="bg-[#ef3a4c] hover:bg-[#d83445] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mt-2"
        >
          Add Another Message
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="existingAssets" className="block text-gray-700 text-sm font-bold mb-2">Do you have existing brand guidelines, a brand book, or any current assets (logos, fonts, color palettes, imagery) we should be aware of or incorporate? If so, please provide them (links or description).</label>
        <textarea
          id="existingAssets"
          name="existingAssets"
          value={briefData.existingAssets}
          onChange={handleChange}
          rows="3"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="Provide links to cloud storage, or describe assets."
        ></textarea>
        {/* The corrected Asset Links text area */}
        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          <label htmlFor="assetLinks" className="block text-gray-700 text-sm font-bold mb-2">Share assets link here:</label>
          <textarea
            id="assetLinks"
            name="assetLinks"
            value={briefData.assetLinks}
            onChange={handleChange}
            rows="3"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
            placeholder="e.g., Google Drive folder link, Dropbox link, etc."
          ></textarea>
        </div>
      </div>
    </div>,

    // Step 4: Specific Project Details (Dynamic based on projectTypes)
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#ef3a4c] mb-6">Chapter 4: Crafting the Masterpiece</h2>
      <p className="text-gray-700 text-center mb-8">Let's dive into the specifics of your chosen project(s).</p>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">5. Specific Project Details</h3>

      {briefData.projectTypes.includes('Make a Logo (Brand Identity)') && (
        <div className="mb-8 p-6 border border-[#ef3a4c] border-opacity-50 rounded-xl bg-neutral-50">
          <h4 className="text-xl font-bold text-[#ef3a4c] mb-4">A. Make a Logo (Brand Identity)</h4>
          <div className="mb-4">
            <label htmlFor="logo.currentLogo" className="block text-gray-700 text-sm font-bold mb-2">Do you have a current logo? If so, what are its strengths and weaknesses, and why are you looking to change/update it?</label>
            <textarea
              id="logo.currentLogo"
              name="logo.currentLogo"
              value={briefData.logo.currentLogo}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">What desired style are you envisioning for the new logo? (Select all that apply)</label>
            {['Minimalist', 'Illustrative', 'Bold', 'Abstract', 'Wordmark', 'Emblem', 'Mascot', 'Calligraphic/Arabic Inspired'].map(style => (
              <label key={style} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="logo.desiredStyle"
                  data-field="logo.desiredStyle"
                  value={style}
                  checked={briefData.logo.desiredStyle.includes(style)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{style}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="logo.colors" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific colors you'd like to include or avoid? What emotions or associations do you want your colors to evoke?</label>
            <textarea
              id="logo.colors"
              name="logo.colors"
              value={briefData.logo.colors}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Warm desert tones for hospitality, avoid bright reds.'"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="logo.inspirations" className="block text-gray-700 text-sm font-bold mb-2">Please share any logos (from other companies/brands) that you admire or dislike, and explain why. (Provide links if possible)</label>
            <textarea
              id="logo.inspirations"
              name="logo.inspirations"
              value={briefData.logo.inspirations}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="Provide links or descriptions."
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Where will this logo primarily be used? (Select all that apply)</label>
            {['Website', 'Social Media', 'Print Materials', 'Signage', 'Merchandise', 'App Icon', 'Video/Animation'].map(usage => (
              <label key={usage} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="logo.primaryUsage"
                  data-field="logo.primaryUsage"
                  value={usage}
                  checked={briefData.logo.primaryUsage.includes(usage)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{usage}</span>
              </label>
            ))}
          </div>
          {/* NEW: Visual Elements to Include/Avoid */}
          <div className="mb-4">
            <label htmlFor="logo.visualElementsToInclude" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific visual elements, imagery, or symbols that *must* be included in the logo design?</label>
            <textarea
              id="logo.visualElementsToInclude"
              name="logo.visualElementsToInclude"
              value={briefData.logo.visualElementsToInclude}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Must incorporate a falcon,' 'A stylized date palm.'"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="logo.visualElementsToAvoid" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific visual elements, imagery, or symbols that *must* be strictly avoided in the logo design?</label>
            <textarea
              id="logo.visualElementsToAvoid"
              name="logo.visualElementsToAvoid"
              value={briefData.logo.visualElementsToAvoid}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Avoid overtly religious symbols,' 'No sharp angles.'"
            ></textarea>
          </div>
        </div>
      )}

      {briefData.projectTypes.includes('Create a Booth (Exhibition/Experiential Design)') && (
        <div className="mb-8 p-6 border border-[#ef3a4c] border-opacity-50 rounded-xl bg-neutral-50">
          <h4 className="text-xl font-bold text-[#ef3a4c] mb-4">B. Create a Booth (Exhibition/Experiential Design)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="booth.eventName" className="block text-gray-700 text-sm font-bold mb-2">Event Name:</label>
              <input type="text" id="booth.eventName" name="booth.eventName" value={briefData.booth.eventName} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" />
            </div>
            <div>
              <label htmlFor="booth.datesLocation" className="block text-gray-700 text-sm font-bold mb-2">Dates and Location:</label>
              <input type="text" id="booth.datesLocation" name="booth.datesLocation" value={briefData.booth.datesLocation} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" placeholder="e.g., 'Nov 1-3, 2025, Riyadh Exhibition Center'" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="booth.sizeDimensions" className="block text-gray-700 text-sm font-bold mb-2">Approximate Booth Size and Dimensions:</label>
            <input type="text" id="booth.sizeDimensions" name="booth.sizeDimensions" value={briefData.booth.sizeDimensions} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" placeholder="e.g., '10x10 ft, 20x20 ft, custom'" />
          </div>
          <div className="mb-4">
            <label htmlFor="booth.budgetRange" className="block text-gray-700 text-sm font-bold mb-2">Estimated Budget Range for Booth Design & Fabrication:</label>
            <input type="text" id="booth.budgetRange" name="booth.budgetRange" value={briefData.booth.budgetRange} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">What key products, services, or messages do you want to highlight within the booth?</label>
            {briefData.booth.keyHighlights.map((highlight, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  name="booth.keyHighlights"
                  data-index={index}
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...briefData.booth.keyHighlights];
                    newHighlights[index] = e.target.value;
                    setBriefData(prev => ({
                      ...prev,
                      booth: { ...prev.booth, keyHighlights: newHighlights }
                    }));
                  }}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c] mr-2"
                  placeholder={`Highlight ${index + 1}`}
                />
                {briefData.booth.keyHighlights.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setBriefData(prev => ({
                        ...prev,
                        booth: { ...prev.booth, keyHighlights: prev.booth.keyHighlights.filter((_, i) => i !== index) }
                      }));
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline"
                    aria-label="Remove highlight"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setBriefData(prev => ({
                  ...prev,
                  booth: { ...prev.booth, keyHighlights: [...prev.booth.keyHighlights, ''] }
                }));
              }}
              className="bg-[#ef3a4c] hover:bg-[#d83445] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mt-2"
            >
              Add Another Highlight
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">What kind of experience do you want visitors to have when they interact with your booth? (Select all that apply)</label>
            {['Educational', 'Immersive', 'Interactive', 'Welcoming', 'High-tech', 'Networking Focused', 'Product Demo'].map(exp => (
              <label key={exp} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="booth.visitorExperience"
                  data-field="booth.visitorExperience"
                  value={exp}
                  checked={briefData.booth.visitorExperience.includes(exp)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{exp}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Are there any specific technical requirements? (Select all that apply)</label>
            {['Power Outlets', 'Internet Access', 'Multiple Screens', 'Demo Stations', 'Audio System', 'Special Lighting', 'Water Access'].map(req => (
              <label key={req} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="booth.technicalRequirements"
                  data-field="booth.technicalRequirements"
                  value={req}
                  checked={briefData.booth.technicalRequirements.includes(req)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{req}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="booth.inspirations" className="block text-gray-700 text-sm font-bold mb-2">Please share any booth designs (from other companies/events) that you admire or dislike, and explain why. (Provide links if possible)</label>
            <textarea
              id="booth.inspirations"
              name="booth.inspirations"
              value={briefData.booth.inspirations}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Provide links or descriptions.'"
            ></textarea>
          </div>
          {/* NEW: Visual Elements to Include/Avoid for Booth */}
          <div className="mb-4">
            <label htmlFor="booth.visualElementsToInclude" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific visual elements, imagery, or symbols that *must* be included in the booth design?</label>
            <textarea
              id="booth.visualElementsToInclude"
              name="booth.visualElementsToInclude"
              value={briefData.booth.visualElementsToInclude}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Saudi flag elements,' 'Specific architectural features.'"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="booth.visualElementsToAvoid" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific visual elements, imagery, or symbols that *must* be strictly avoided in the booth design?</label>
            <textarea
              id="booth.visualElementsToAvoid"
              name="booth.visualElementsToAvoid"
              value={briefData.booth.visualElementsToAvoid}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Avoid crowded imagery,' 'No specific cultural symbols if not representative of our values.'"
            ></textarea>
          </div>
        </div>
      )}

      {briefData.projectTypes.includes('Imagine an Event Theme & Design the Event Journey/Experience') && (
        <div className="mb-8 p-6 border border-[#ef3a4c] border-opacity-50 rounded-xl bg-neutral-50">
          <h4 className="text-xl font-bold text-[#ef3a4c] mb-4">C. Imagine an Event Theme & Design the Event Journey/Experience</h4>
          <div className="mb-4">
            <label htmlFor="event.eventName" className="block text-gray-700 text-sm font-bold mb-2">Event Name:</label>
            <input type="text" id="event.eventName" name="event.eventName" value={briefData.event.eventName} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" />
          </div>
          <div className="mb-4">
            <label htmlFor="event.datesLocationDuration" className="block text-gray-700 text-sm font-bold mb-2">Dates, Location, and Duration:</label>
            <input type="text" id="event.datesLocationDuration" name="event.datesLocationDuration" value={briefData.event.datesLocationDuration} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" placeholder="e.g., 'Dec 10-12, 2025, King Abdullah Park, 3 days'" />
          </div>
          <div className="mb-4">
            <label htmlFor="event.purposeObjective" className="block text-gray-700 text-sm font-bold mb-2">Primary Purpose or Objective of this Event:</label>
            <textarea
              id="event.purposeObjective"
              name="event.purposeObjective"
              value={briefData.event.purposeObjective}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Product launch, client appreciation, thought leadership conference'"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="event.estimatedAttendees" className="block text-gray-700 text-sm font-bold mb-2">Estimated Number of Attendees:</label>
            <input type="number" id="event.estimatedAttendees" name="event.estimatedAttendees" value={briefData.event.estimatedAttendees} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">What desired mood or atmosphere do you want to create for the event? (Select all that apply)</label>
            {['Energetic', 'Sophisticated', 'Intimate', 'Celebratory', 'Futuristic', 'Traditional', 'Relaxed'].map(mood => (
              <label key={mood} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="event.desiredMood"
                  data-field="event.desiredMood"
                  value={mood}
                  checked={briefData.event.desiredMood.includes(mood)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{mood}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Are there any key moments, activities, or speakers already planned that we need to integrate into the journey?</label>
            {briefData.event.keyMoments.map((moment, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  name="event.keyMoments"
                  data-index={index}
                  value={moment}
                  onChange={(e) => {
                    const newMoments = [...briefData.event.keyMoments];
                    newMoments[index] = e.target.value;
                    setBriefData(prev => ({
                      ...prev,
                      event: { ...prev.event, keyMoments: newMoments }
                    }));
                  }}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c] mr-2"
                  placeholder={`Moment ${index + 1}`}
                />
                {briefData.event.keyMoments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setBriefData(prev => ({
                        ...prev,
                        event: { ...prev.event, keyMoments: prev.event.keyMoments.filter((_, i) => i !== index) }
                      }));
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline"
                    aria-label="Remove moment"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setBriefData(prev => ({
                  ...prev,
                  event: { ...prev.event, keyMoments: [...prev.event.keyMoments, ''] }
                }));
              }}
              className="bg-[#ef3a4c] hover:bg-[#d83445] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mt-2"
            >
              Add Another Moment
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="event.venueConsiderations" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific venue considerations or limitations we should be aware of?</label>
            <textarea
              id="event.venueConsiderations"
              name="event.venueConsiderations"
              value={briefData.event.venueConsiderations}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Outdoor space needed, specific cultural restrictions, capacity limits.'"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="event.budgetRange" className="block text-gray-700 text-sm font-bold mb-2">Estimated Budget Range for Event Design & Experience Elements:</label>
            <input type="text" id="event.budgetRange" name="event.budgetRange" value={briefData.event.budgetRange} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" />
          </div>
          <div className="mb-4">
            <label htmlFor="event.inspirations" className="block text-gray-700 text-sm font-bold mb-2">Please share any events (or elements from events) that you admire or dislike, and explain why. (Provide links if possible)</label>
            <textarea
              id="event.inspirations"
              name="event.inspirations"
              value={briefData.event.inspirations}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Provide links or descriptions.'"
            ></textarea>
          </div>
          {/* NEW: Visual Elements to Include/Avoid for Event */}
          <div className="mb-4">
            <label htmlFor="event.visualElementsToInclude" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific visual elements, imagery, or symbols that *must* be included in the event design?</label>
            <textarea
              id="event.visualElementsToInclude"
              name="event.visualElementsToInclude"
              value={briefData.event.visualElementsToInclude}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Themes representing Saudi heritage,' 'Modern art installations.'"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="event.visualElementsToAvoid" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific visual elements, imagery, or symbols that *must* be strictly avoided in the event design?</label>
            <textarea
              id="event.visualElementsToAvoid"
              name="event.visualElementsToAvoid"
              value={briefData.event.visualElementsToAvoid}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Avoid anything overly secular,' 'No specific political symbols.'"
            ></textarea>
          </div>
        </div>
      )}

      {briefData.projectTypes.includes('Create a Layout or Main Key Visual for a Campaign') && (
        <div className="mb-8 p-6 border border-[#ef3a4c] border-opacity-50 rounded-xl bg-neutral-50">
          <h4 className="text-xl font-bold text-[#ef3a4c] mb-4">D. Create a Layout or Main Key Visual for a Campaign</h4>
          <div className="mb-4">
            <label htmlFor="campaign.campaignNameDuration" className="block text-gray-700 text-sm font-bold mb-2">Campaign Name and Planned Duration:</label>
            <input type="text" id="campaign.campaignNameDuration" name="campaign.campaignNameDuration" value={briefData.campaign.campaignNameDuration} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" placeholder="e.g., 'Summer Sales Campaign, 3 months'" />
          </div>
          <div className="mb-4">
            <label htmlFor="campaign.coreMessageSlogan" className="block text-gray-700 text-sm font-bold mb-2">Core Message or Slogan for this Campaign:</label>
            <input type="text" id="campaign.coreMessageSlogan" name="campaign.coreMessageSlogan" value={briefData.campaign.coreMessageSlogan} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Which channels will this layout/key visual be used on? (Select all that apply)</label>
            {['Print Ads', 'Billboards/OOH', 'Social Media Posts', 'Website Banners', 'Email Headers', 'Video Thumbnails', 'TV/Digital Video Ads'].map(channel => (
              <label key={channel} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="campaign.channels"
                  data-field="campaign.channels"
                  value={channel}
                  checked={briefData.campaign.channels.includes(channel)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{channel}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">What desired visual style or mood are you aiming for? (Select all that apply)</label>
            {['Bold and Impactful', 'Soft and Elegant', 'Playful and Quirky', 'Serious and Authoritative', 'Futuristic', 'Traditional Saudi', 'Minimalist'].map(style => (
              <label key={style} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="campaign.visualStyleMood"
                  data-field="campaign.visualStyleMood"
                  value={style}
                  checked={briefData.campaign.visualStyleMood.includes(style)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{style}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Are there any specific elements that *must* be included in the visual? (Select all that apply)</label>
            {['Product Shot', 'Specific People (e.g., local models)', 'Call-to-Action Button', 'Logo Placement', 'QR Code', 'Specific Text/Slogan'].map(element => (
              <label key={element} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="campaign.elementsToInclude"
                  data-field="campaign.elementsToInclude"
                  value={element}
                  checked={briefData.campaign.elementsToInclude.includes(element)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 accent-[#ef3a4c] rounded-md"
                />
                <span className="ml-2 text-gray-700">{element}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="campaign.callToAction" className="block text-gray-700 text-sm font-bold mb-2">What is the primary Call to Action (CTA) for this campaign?</label>
            <input type="text" id="campaign.callToAction" name="campaign.callToAction" value={briefData.campaign.callToAction} onChange={handleChange} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]" placeholder="e.g., 'Learn More,' 'Shop Now,' 'Download the App'" />
          </div>
          <div className="mb-4">
            <label htmlFor="campaign.inspirations" className="block text-gray-700 text-sm font-bold mb-2">Please share any campaign visuals (from other companies/brands) that you admire or dislike, and explain why. (Provide links if possible)</label>
            <textarea
              id="campaign.inspirations"
              name="campaign.inspirations"
              value={briefData.inspirations}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Provide links or descriptions.'"
            ></textarea>
          </div>
          {/* NEW: Visual Elements to Include/Avoid for Campaign */}
          <div className="mb-4">
            <label htmlFor="campaign.visualElementsToInclude" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific visual elements, imagery, or symbols that *must* be included in the campaign visual?</label>
            <textarea
              id="campaign.visualElementsToInclude"
              name="campaign.visualElementsToInclude"
              value={briefData.campaign.visualElementsToInclude}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Specific cultural landmarks,' 'Imagery of families,' 'Traditional patterns.'"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="campaign.visualElementsToAvoid" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific visual elements, imagery, or symbols that *must* be strictly avoided in the campaign visual?</label>
            <textarea
              id="campaign.visualElementsToAvoid"
              name="campaign.visualElementsToAvoid"
              value={briefData.campaign.visualElementsToAvoid}
              onChange={handleChange}
              rows="2"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
              placeholder="e.g., 'Avoid controversial imagery,' 'No specific regional symbols if the campaign is national.'"
            ></textarea>
          </div>
        </div>
      )}

      {briefData.projectTypes.length === 0 && (
        <p className="text-center text-gray-500 italic">Please select a project type in the "Project Overview" section to see specific details here.</p>
      )}
    </div>,

    // Step 5: Budget & Timeline
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#ef3a4c] mb-6">Chapter 5: Resources & Timeframe</h2>
      <p className="text-gray-700 text-center mb-8">Manage the practical elements of your creative journey.</p>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">6. Budget & Timeline</h3>
      <div className="mb-6">
        <label htmlFor="estimatedBudget" className="block text-gray-700 text-sm font-bold mb-2">What is your estimated budget range for this project?</label>
        <select
          id="estimatedBudget"
          name="estimatedBudget"
          value={briefData.estimatedBudget}
          onChange={handleChange}
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          required
        >
          <option value="">Select Budget Range</option>
          <option value="SAR 10,000 - 25,000">SAR 10,000 - 25,000</option>
          <option value="SAR 25,001 - 50,000">SAR 25,001 - 50,000</option>
          <option value="SAR 50,001 - 100,000">SAR 50,001 - 100,000</option>
          <option value="SAR 100,001+">SAR 100,001+</option>
          <option value="To be discussed">To be discussed</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">What are your key deadlines or desired milestones for this project?</label>
        {briefData.keyDeadlines.map((deadline, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              name="keyDeadlines"
              data-index={index}
              value={deadline}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c] mr-2"
              placeholder={`Milestone ${index + 1} (e.g., 'Initial concepts by [Date]')`}
            />
            {briefData.keyDeadlines.length > 0 && (
              <button
                type="button"
                onClick={() => removeInputField('keyDeadlines', index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline"
                aria-label="Remove deadline"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addInputField('keyDeadlines')}
          className="bg-[#ef3a4c] hover:bg-[#d83445] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mt-2"
        >
          Add Another Deadline
        </button>
      </div>
    </div>,

    // Step 6: Competitors & Additional Notes
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#ef3a4c] mb-6">Chapter 6: The Wider Landscape</h2>
      <p className="text-gray-700 text-center mb-8">Understand the environment your project will exist within.</p>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">7. Competitors</h3>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Who are your main competitors in the market?</label>
        {briefData.mainCompetitors.map((competitor, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              name="mainCompetitors"
              data-index={index}
              value={competitor}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c] mr-2"
              placeholder={`Competitor ${index + 1}`}
            />
            {briefData.mainCompetitors.length > 0 && (
              <button
                type="button"
                onClick={() => removeInputField('mainCompetitors', index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline"
                aria-label="Remove competitor"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addInputField('mainCompetitors')}
          className="bg-[#ef3a4c] hover:bg-[#d83445] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mt-2"
        >
          Add Another Competitor
        </button>
      </div>
      <div className="mb-6">
        <label htmlFor="competitorLikesDislikes" className="block text-gray-700 text-sm font-bold mb-2">What do you like or dislike about their visual communication, branding, or marketing efforts?</label>
        <textarea
          id="competitorLikesDislikes"
          name="competitorLikesDislikes"
          value={briefData.competitorLikesDislikes}
          onChange={handleChange}
          rows="3"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
        ></textarea>
      </div>

      {/* Cultural Sensitivities/Preferences */}
      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">Cultural Considerations</h3>
      <div className="mb-6">
        <label htmlFor="culturalSensitivities" className="block text-gray-700 text-sm font-bold mb-2">Are there any specific cultural nuances, traditions, or sensitivities unique to the Saudi context that we should be particularly mindful of in the design, imagery, or messaging?</label>
        <textarea
          id="culturalSensitivities"
          name="culturalSensitivities"
          value={briefData.culturalSensitivities}
          onChange={handleChange}
          rows="3"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
          placeholder="e.g., 'Color associations, symbolism, representation of people/gender, specific regional customs.'"
        ></textarea>
      </div>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">8. Additional Notes / Information</h3>
      <div className="mb-6">
        <label htmlFor="additionalNotes" className="block text-gray-700 text-sm font-bold mb-2">Is there anything else you'd like to share or any specific requirements not covered above that you feel are important for us to know?</label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          value={briefData.additionalNotes}
          onChange={handleChange}
          rows="4"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#ef3a4c]"
        ></textarea>
      </div>
    </div>,

    // Step 7: Completion/Summary
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#ef3a4c] mb-6">Your Vision Revealed!</h2>
      <p className="text-gray-700 text-center mb-8">Congratulations, Visionary! You've completed your creative blueprint. We now have the insights needed to bring your vision to life.</p>

      <h3 className="text-2xl font-semibold text-[#ef3a4c] mb-4 border-b pb-2 border-opacity-50 border-[#ef3a4c]">Summary of Your Brief</h3>
      <div className="text-gray-800 space-y-3">
        {Object.entries(briefData).map(([key, value]) => {
          // Function to format keys
          const formatKey = (str) => str.replace(/([A-Z])/g, ' $1').replace(/^./, (match) => match.toUpperCase());

          // Handle nested objects for specific sections
          if (typeof value === 'object' && !Array.isArray(value)) {
            if (key === 'brandPersonality') {
              return (
                <div key={key}>
                  <p className="font-semibold">{formatKey(key)}:</p>
                  <ul className="list-disc list-inside ml-4">
                    {Object.entries(value).map(([traitKey, traitValue]) => (
                      <li key={traitKey}>{traitKey.replace(/([A-Z])/g, ' $1').replace('modernTraditional', 'Modern').replace('playfulSerious', 'Playful').replace('luxuriousApproachable', 'Luxurious').replace('edgyTrustworthy', 'Edgy').replace('dynamicCalm', 'Calm')}: {traitValue}%</li>
                    ))}
                  </ul>
                </div>
              );
            } else if (key === 'audienceDemographics') {
                return (
                    <div key={key}>
                        <p className="font-semibold">{formatKey(key)}:</p>
                        <ul className="list-disc list-inside ml-4">
                            {Object.entries(value).map(([demographicKey, demographicValue]) => (
                                <li key={demographicKey}>{formatKey(demographicKey)}: {Array.isArray(demographicValue) ? demographicValue.join(', ') : demographicValue}</li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (briefData.projectTypes.includes('Make a Logo (Brand Identity)') && key === 'logo') {
                return (
                    <div key={key}>
                        <p className="font-semibold">{formatKey(key)} Details:</p>
                        <ul className="list-disc list-inside ml-4">
                            {Object.entries(value).map(([logoKey, logoValue]) => (
                                <li key={logoKey}>{formatKey(logoKey)}: {Array.isArray(logoValue) ? logoValue.join(', ') : logoValue}</li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (briefData.projectTypes.includes('Create a Booth (Exhibition/Experiential Design)') && key === 'booth') {
                return (
                    <div key={key}>
                        <p className="font-semibold">{formatKey(key)} Details:</p>
                        <ul className="list-disc list-inside ml-4">
                            {Object.entries(value).map(([boothKey, boothValue]) => (
                                <li key={boothKey}>{formatKey(boothKey)}: {Array.isArray(boothValue) ? boothValue.join(', ') : boothValue}</li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (briefData.projectTypes.includes('Imagine an Event Theme & Design the Event Journey/Experience') && key === 'event') {
                return (
                    <div key={key}>
                        <p className="font-semibold">{formatKey(key)} Details:</p>
                        <ul className="list-disc list-inside ml-4">
                            {Object.entries(value).map(([eventKey, eventValue]) => (
                                <li key={eventKey}>{formatKey(eventKey)}: {Array.isArray(eventValue) ? eventValue.join(', ') : eventValue}</li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (briefData.projectTypes.includes('Create a Layout or Main Key Visual for a Campaign') && key === 'campaign') {
                return (
                    <div key={key}>
                        <p className="font-semibold">{formatKey(key)} Details:</p>
                        <ul className="list-disc list-inside ml-4">
                            {Object.entries(value).map(([campaignKey, campaignValue]) => (
                                <li key={campaignKey}>{formatKey(campaignKey)}: {Array.isArray(campaignValue) ? campaignValue.join(', ') : campaignValue}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
            return null;
          }
          if (Array.isArray(value) && value.length > 0) {
            return <p key={key}><span className="font-semibold">{formatKey(key)}:</span> {value.join(', ')}</p>;
          }
          if (typeof value === 'string' && value.trim() !== '') {
            return <p key={key}><span className="font-semibold">{formatKey(key)}:</span> {value}</p>;
          }
          return null;
        })}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmitBrief}
          className="bg-[#ef3a4c] hover:bg-[#d83445] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mr-4"
        >
          Submit Brief
        </button>
        <button
          onClick={handleEmailUs}
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mr-4"
        >
          Email Us
        </button>
        <button
          onClick={handlePrintPdf}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Download brief as a PDF
        </button>
      </div>
    </div>,
  ];

  // Function to navigate to the next step
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  // Function to navigate to the previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Calculate progress for the progress bar
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex flex-col items-center justify-center p-4 font-inter">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl bg-gray-200 rounded-full h-2.5 mb-8">
        <div className="bg-[#ef3a4c] h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Current Step Content */}
      {steps[currentStep]}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between w-full max-w-2xl">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-bold transition duration-300 ease-in-out ${
            currentStep === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#ef3a4c] hover:bg-[#d83445] text-white shadow-md transform hover:scale-105'
          }`}
        >
          Back
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="px-6 py-3 rounded-lg font-bold bg-[#ef3a4c] hover:bg-[#d83445] text-white shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmitBrief}
            className="bg-[#ef3a4c] hover:bg-[#d83445] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit Brief
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
