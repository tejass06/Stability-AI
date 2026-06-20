'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  Home,
  Users,
  Tent,
  AlertTriangle,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Info,
  Building,
  Loader2,
  LogOut,
} from 'lucide-react';

import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  Card,
  CardContent,
} from '../../components/ui/Card';
import { generatePlan } from '../utils/api';

interface HousingCardProps {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}

function HousingCard({
  icon,
  title,
  active,
  onClick,
}: HousingCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: '88px',
        border: active
          ? '1px solid #072B84'
          : '1px solid #D9DDE5',
        background: active
          ? '#E8F0FF'
          : '#FFFFFF',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          minWidth: '40px',
          borderRadius: '8px',
          background: '#F5F6FA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? '#072B84' : '#4B5563',
        }}
      >
        {icon}
      </div>

      <span
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#111827',
          lineHeight: '20px',
        }}
      >
        {title}
      </span>
    </button>
  );
}

interface ProgressItemProps {
  label: string;
  complete?: boolean;
  active?: boolean;
}

function ProgressItem({
  label,
  complete = false,
  active = false,
}: ProgressItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {complete ? (
        <CheckCircle2
          size={16}
          color="#10B981"
        />
      ) : active ? (
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '999px',
            border: '2px solid #072B84',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '999px',
              background: '#072B84',
            }}
          />
        </div>
      ) : (
        <Circle
          size={16}
          color="#D1D5DB"
        />
      )}

      <span
        style={{
          fontSize: '13px',
          fontWeight: active
            ? 600
            : 500,
          color: active
            ? '#111827'
            : '#6B7280',
        }}
      >
        {label}
      </span>
    </div>
  );
}

type HousingType =
  | 'apartment'
  | 'single-family'
  | 'shared'
  | 'shelter'
  | 'unstable'
  | '';

const steps = [
  { id: 1, label: 'Housing' },
  { id: 2, label: 'Eviction' },
  { id: 3, label: 'Financial' },
  { id: 4, label: 'Review' },
];

export default function IntakeWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  // Show logout toast if redirected from logout
  useEffect(() => {
    if (searchParams.get('loggedOut') === '1') {
      setShowLogoutToast(true);
      // Auto-hide after 4 seconds
      const t = setTimeout(() => setShowLogoutToast(false), 4000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  // Form Fields State
  const [state, setState] = useState('California');
  const [zipCode, setZipCode] = useState('');
  const [housingType, setHousingType] = useState<HousingType>('');
  const [rentAmount, setRentAmount] = useState('0.00');
  const [county, setCounty] = useState('');
  const [situation, setSituation] = useState('');
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(14);
  const [income, setIncome] = useState('0.00');
  const [householdSize, setHouseholdSize] = useState(1);

  // UI Flow State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    // Basic validation
    if (currentStep === 1) {
      if (!zipCode) {
        setError('Please enter a zip code.');
        return;
      }
      if (!housingType) {
        setError('Please select a housing type.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!situation.trim()) {
        setError('Please describe your housing situation.');
        return;
      }
    }

    setError('');
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const plan = await generatePlan({
        state,
        county: county || 'Unknown County',
        situation,
        daysUntilDeadline: Number(daysUntilDeadline),
        income: parseFloat(income) || 0,
        householdSize: Number(householdSize) || 1,
      });

      // Save plan sessionId for retrieval
      localStorage.setItem('activeSessionId', plan.sessionId);

      // Route to Action Plan
      router.push('/action-plans');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the plan. Please check your backend connection.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Logout Toast */}
      {showLogoutToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: '#10B981',
            color: '#FFFFFF',
            borderRadius: '10px',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(16,185,129,0.35)',
            animation: 'slideDown 0.3s ease',
          }}
        >
          <LogOut size={18} />
          You have been logged out successfully.
          <button
            onClick={() => setShowLogoutToast(false)}
            style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}

      <Header
        title="Intake Wizard"
        subtitle="Housing Stability Assessment"
      />

      <main className="page-container">
        {/* Intro */}
        <section
          style={{
            marginBottom: '24px',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#072B84',
              marginBottom: '8px',
            }}
          >
            Housing Stability Assessment
          </h1>

          <p
            style={{
              maxWidth: '760px',
              color: '#6B7280',
              fontSize: '14px',
              lineHeight: '24px',
            }}
          >
            Complete this assessment to receive
            a personalized legal action plan and
            connect with emergency rental
            assistance programs in your area.
          </p>
        </section>

        {/* Stepper */}
        <Card
          style={{
            marginBottom: '24px',
          }}
        >
          <CardContent
            style={{
              paddingTop: '20px',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                maxWidth: '900px',
                margin: '0 auto',
              }}
            >
              {/* Background Line */}
              <div
                style={{
                  position: 'absolute',
                  left: '40px',
                  right: '40px',
                  top: '24px',
                  height: '2px',
                  background: '#E5E7EB',
                  zIndex: 0,
                }}
              />

              {steps.map((step) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                  <div
                    key={step.id}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '14px',
                        border:
                          isActive
                            ? '2px solid #072B84'
                            : isCompleted
                            ? '2px solid #072B84'
                            : '2px solid #D9DDE5',
                        background:
                          isActive
                            ? '#072B84'
                            : isCompleted
                            ? '#E8F0FF'
                            : '#FFFFFF',
                        color:
                          isActive
                            ? '#FFFFFF'
                            : isCompleted
                            ? '#072B84'
                            : '#9CA3AF',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {step.id}
                    </div>

                    <span
                      style={{
                        marginTop: '10px',
                        fontSize: '12px',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#072B84' : '#6B7280',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Layout */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '2.4fr 1fr',
            gap: '24px',
          }}
          className="intake-layout"
        >
          {/* LEFT PANEL */}
          <Card>
            <CardContent
              style={{
                paddingTop: '20px',
              }}
            >
              {error && (
                <div
                  style={{
                    background: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#B91C1C',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {error}
                </div>
              )}

              {isLoading ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    textAlign: 'center',
                  }}
                >
                  <Loader2
                    size={48}
                    className="animate-spin"
                    color="#072B84"
                    style={{ marginBottom: '20px', animation: 'spin 1.5s linear infinite' }}
                  />
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#072B84', marginBottom: '8px' }}>
                    AI Plan Generation In Progress
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '14px', maxWidth: '400px', lineHeight: '22px' }}>
                    Gemini is processing your situation to create a customized legal action timeline and outline your local housing rights.
                  </p>
                </div>
              ) : (
                <>
                  {/* STEP 1: HOUSING */}
                  {currentStep === 1 && (
                    <div>
                      <h2
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#072B84',
                          marginBottom: '20px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid #EEF1F5',
                        }}
                      >
                        Current Housing Situation
                      </h2>

                      {/* State + Zip */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                          marginBottom: '24px',
                        }}
                        className="intake-grid-two"
                      >
                        <div>
                          <label
                            style={{
                              display: 'block',
                              marginBottom: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#6B7280',
                              textTransform: 'uppercase',
                            }}
                          >
                            State of Residence
                          </label>

                          <div style={{ position: 'relative' }}>
                            <select
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              style={{
                                width: '100%',
                                height: '44px',
                                border: '1px solid #D9DDE5',
                                borderRadius: '6px',
                                padding: '0 40px 0 12px',
                                background: '#FFFFFF',
                                appearance: 'none',
                                fontWeight: 600,
                              }}
                            >
                              <option value="California">California</option>
                              <option value="New York">New York</option>
                              <option value="Texas">Texas</option>
                              <option value="Florida">Florida</option>
                            </select>

                            <ChevronDown
                              size={16}
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '14px',
                                color: '#6B7280',
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            style={{
                              display: 'block',
                              marginBottom: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#6B7280',
                              textTransform: 'uppercase',
                            }}
                          >
                            Zip Code
                          </label>

                          <input
                            type="text"
                            placeholder="10001"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            style={{
                              width: '100%',
                              height: '44px',
                              border: '1px solid #D9DDE5',
                              borderRadius: '6px',
                              padding: '0 12px',
                              fontWeight: 600,
                            }}
                          />
                        </div>
                      </div>

                      {/* Housing Type */}
                      <div style={{ marginBottom: '24px' }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                          }}
                        >
                          Current Housing Type
                        </label>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                          }}
                          className="intake-grid-two"
                        >
                          <HousingCard
                            icon={<Building2 size={18} />}
                            title="Apartment / Multi-family"
                            active={housingType === 'apartment'}
                            onClick={() => setHousingType('apartment')}
                          />

                          <HousingCard
                            icon={<Home size={18} />}
                            title="Single Family House"
                            active={housingType === 'single-family'}
                            onClick={() => setHousingType('single-family')}
                          />

                          <HousingCard
                            icon={<Users size={18} />}
                            title="Shared Housing"
                            active={housingType === 'shared'}
                            onClick={() => setHousingType('shared')}
                          />

                          <HousingCard
                            icon={<Tent size={18} />}
                            title="Shelter / Temporary"
                            active={housingType === 'shelter'}
                            onClick={() => setHousingType('shelter')}
                          />
                        </div>

                        {/* Unstable Housing Option */}
                        <div
                          onClick={() => setHousingType('unstable')}
                          style={{
                            marginTop: '12px',
                            border:
                              housingType === 'unstable'
                                ? '1px solid #072B84'
                                : '1px solid #D9DDE5',
                            background:
                              housingType === 'unstable'
                                ? '#E8F0FF'
                                : '#FFFFFF',
                            borderRadius: '8px',
                            padding: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: '#FEF3C7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <AlertTriangle
                              size={18}
                              color="#D97706"
                            />
                          </div>

                          <div>
                            <div style={{ fontWeight: 600, color: '#111827' }}>
                              Unstable / No Permanent Address
                            </div>

                            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                              Couch surfing, hotel, vehicle, or no stable housing.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rent Amount */}
                      <div
                        style={{
                          borderTop: '1px solid #EEF1F5',
                          paddingTop: '20px',
                          marginTop: '20px',
                        }}
                      >
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                          }}
                        >
                          Monthly Rent Amount
                        </label>

                        <div style={{ position: 'relative', maxWidth: '320px' }}>
                          <span
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '12px',
                              color: '#6B7280',
                              fontWeight: 600,
                            }}
                          >
                            $
                          </span>

                          <input
                            type="text"
                            value={rentAmount}
                            onChange={(e) => setRentAmount(e.target.value)}
                            style={{
                              width: '100%',
                              height: '44px',
                              border: '1px solid #D9DDE5',
                              borderRadius: '6px',
                              padding: '0 12px 0 28px',
                              fontWeight: 600,
                            }}
                          />
                        </div>

                        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
                          If rent is shared, enter only your portion.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: EVICTION */}
                  {currentStep === 2 && (
                    <div>
                      <h2
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#072B84',
                          marginBottom: '20px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid #EEF1F5',
                        }}
                      >
                        Eviction / Legal Notice Details
                      </h2>

                      <div style={{ marginBottom: '24px' }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                          }}
                        >
                          County / Municipality Name
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Los Angeles, Cook, Harris"
                          value={county}
                          onChange={(e) => setCounty(e.target.value)}
                          style={{
                            width: '100%',
                            height: '44px',
                            border: '1px solid #D9DDE5',
                            borderRadius: '6px',
                            padding: '0 12px',
                            fontWeight: 600,
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                          }}
                        >
                          Explain Your Current Situation
                        </label>

                        <textarea
                          placeholder="Describe what is happening. E.g., 'My landlord gave me a 3-day pay or quit notice yesterday for overdue rent, but I was unable to work last month because of a medical emergency.'"
                          value={situation}
                          onChange={(e) => setSituation(e.target.value)}
                          style={{
                            width: '100%',
                            height: '120px',
                            border: '1px solid #D9DDE5',
                            borderRadius: '6px',
                            padding: '12px',
                            fontWeight: 500,
                            lineHeight: '20px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                          }}
                        >
                          Days Until Deadline / Response Date: <strong style={{ color: '#072B84' }}>{daysUntilDeadline} Days</strong>
                        </label>

                        <input
                          type="range"
                          min="1"
                          max="60"
                          value={daysUntilDeadline}
                          onChange={(e) => setDaysUntilDeadline(Number(e.target.value))}
                          style={{
                            width: '100%',
                            height: '6px',
                            accentColor: '#072B84',
                            cursor: 'pointer',
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#6B7280' }}>
                          <span>1 Day (Urgent)</span>
                          <span>30 Days</span>
                          <span>60 Days</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: FINANCIAL */}
                  {currentStep === 3 && (
                    <div>
                      <h2
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#072B84',
                          marginBottom: '20px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid #EEF1F5',
                        }}
                      >
                        Financial Profile
                      </h2>

                      <div style={{ marginBottom: '24px' }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                          }}
                        >
                          Monthly Household Income
                        </label>

                        <div style={{ position: 'relative', maxWidth: '320px' }}>
                          <span
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '12px',
                              color: '#6B7280',
                              fontWeight: 600,
                            }}
                          >
                            $
                          </span>

                          <input
                            type="text"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            style={{
                              width: '100%',
                              height: '44px',
                              border: '1px solid #D9DDE5',
                              borderRadius: '6px',
                              padding: '0 12px 0 28px',
                              fontWeight: 600,
                            }}
                          />
                        </div>
                        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
                          Provide total gross income for all members of the household combined.
                        </p>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                          }}
                        >
                          Household Size
                        </label>

                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={householdSize}
                          onChange={(e) => setHouseholdSize(Number(e.target.value))}
                          style={{
                            width: '100%',
                            maxWidth: '160px',
                            height: '44px',
                            border: '1px solid #D9DDE5',
                            borderRadius: '6px',
                            padding: '0 12px',
                            fontWeight: 600,
                          }}
                        />
                        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
                          Total number of individuals currently living in the home.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: REVIEW */}
                  {currentStep === 4 && (
                    <div>
                      <h2
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#072B84',
                          marginBottom: '20px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid #EEF1F5',
                        }}
                      >
                        Review Assessment Details
                      </h2>

                      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px', lineHeight: '22px' }}>
                        Please review the details below. Once submitted, our AI engine will generate customized action plans and identify relevant local tenant resources.
                      </p>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '20px',
                          background: '#F9FAFB',
                          padding: '20px',
                          borderRadius: '8px',
                          border: '1px solid #EEF1F5',
                          marginBottom: '24px',
                        }}
                        className="intake-grid-two"
                      >
                        <div>
                          <strong style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Location
                          </strong>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                            {state} {county ? `(${county} County)` : ''}
                          </span>
                        </div>

                        <div>
                          <strong style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Zip Code
                          </strong>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                            {zipCode}
                          </span>
                        </div>

                        <div>
                          <strong style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Housing & Rent
                          </strong>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>
                            {housingType} (${parseFloat(rentAmount).toFixed(2)}/mo)
                          </span>
                        </div>

                        <div>
                          <strong style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Deadline Timeframe
                          </strong>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#DC2626' }}>
                            {daysUntilDeadline} Days Remaining
                          </span>
                        </div>

                        <div>
                          <strong style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Financials
                          </strong>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                            ${parseFloat(income).toFixed(2)} Income / {householdSize} Occupants
                          </span>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                          <strong style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Housing Situation
                          </strong>
                          <p style={{ fontSize: '14px', color: '#4B5563', margin: 0, lineHeight: '22px', fontStyle: situation ? 'normal' : 'italic' }}>
                            {situation || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div
                    style={{
                      borderTop: '1px solid #EEF1F5',
                      marginTop: '28px',
                      paddingTop: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    {currentStep > 1 ? (
                      <Button
                        variant="secondary"
                        onClick={handleBack}
                        icon={<ArrowLeft size={16} />}
                      >
                        Back
                      </Button>
                    ) : (
                      <div /> // Placeholder to align next button to right
                    )}

                    {currentStep < 4 ? (
                      <Button
                        variant="primary"
                        onClick={handleNext}
                        icon={<ArrowRight size={16} />}
                        iconPosition="right"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        icon={<ArrowRight size={16} />}
                        iconPosition="right"
                      >
                        Generate Action Plan
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* RIGHT SIDEBAR */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Why We Ask */}
            <Card variant="accent">
              <CardContent
                style={{
                  paddingTop: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <Info size={16} />

                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                    }}
                  >
                    Why We Ask
                  </h3>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: '22px',
                    opacity: 0.95,
                  }}
                >
                  Housing laws vary by state and location. Your housing type helps us identify tenant protections, eviction defenses, and emergency assistance programs that may apply.
                </p>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card>
              <CardContent
                style={{
                  paddingTop: '20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    marginBottom: '16px',
                  }}
                >
                  Assessment Progress
                </h3>

                <ProgressBar
                  value={(currentStep / 4) * 100}
                  showLabel
                  customLabel={`Step ${currentStep} of 4`}
                />

                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <ProgressItem
                    complete={currentStep > 1}
                    active={currentStep === 1}
                    label="Housing Information"
                  />

                  <ProgressItem
                    complete={currentStep > 2}
                    active={currentStep === 2}
                    label="Legal Risk Check"
                  />

                  <ProgressItem
                    complete={currentStep > 3}
                    active={currentStep === 3}
                    label="Financial Context"
                  />

                  <ProgressItem
                    complete={currentStep > 4}
                    active={currentStep === 4}
                    label="Review & Submit"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Banner */}
            <Card
              variant="accent"
              style={{
                minHeight: '180px',
                position: 'relative',
              }}
            >
              <CardContent
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  paddingTop: '20px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    opacity: 0.15,
                  }}
                >
                  <Building
                    size={80}
                  />
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '24px',
                  }}
                >
                  Ensuring every neighbor has a place to call home.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <style jsx>{`
          @media (max-width: 1024px) {
            .intake-layout {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .intake-grid-two {
              grid-template-columns: 1fr !important;
            }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1.5s linear infinite;
          }
        `}</style>
      </main>
    </>
  );
}