  import React, { useState, useEffect } from 'react';
import { Plane, Hotel, Snowflake, DollarSign, ShoppingBag, Sun, Moon, MapPin, CalendarDays, Clock, Building, Star, Info, Users, Utensils, Zap, Bus } from 'lucide-react';

// Define exchange rates
const USD_TO_ILS = 3.7;
const EUR_TO_USD = 1.08;
const EUR_TO_ILS = 4.0; // Simplified direct conversion for display

// Data for Mayrhofen, Austria
const mayrhofenData = {
    flights: {
        departure: {
            date: '2026-01-12',
            time: '06:00',
            airline: 'Lufthansa',
            destination: 'מינכן (MUC)',
            destinationEn: 'Munich (MUC)',
            arrivalTime: '09:00',
            notes: 'קיימת גם אופציה עם אל-על + ישראייר',
            notesEn: 'Also available with El Al + Israir',
        },
        return: {
            date: '2026-01-19',
            time: '10:00',
            airline: 'Lufthansa',
            destination: 'תל אביב (TLV)',
            destinationEn: 'Tel Aviv (TLV)',
            arrivalTime: '15:00',
        },
        costUSD: 450, // Lufthansa option cost
    },
    transfers: {
        costEUR: 80, // Estimated shuttle from Munich
        provider: 'שירותי שאטל',
        providerEn: 'Shuttle Service',
        notes: 'הסעה משותפת ממינכן למאיירהופן',
        notesEn: 'Shared shuttle from Munich to Mayrhofen',
        link: 'https://www.shuttledirect.com/' // Example link
    },
    skiPass: {
        dates: '2026-01-13 - 2026-01-17',
        duration: '5 ימים',
        durationEn: '5 days',
        costPerDayEUR: 68,
        totalCostEUR: 340,
        link: 'https://www.zillertal.at/en/tips-more/ski-pass.html'
    },
    equipment: {
        type: 'סנובורד + ציוד בטיחות (קסדה, משקפי סקי, נעליים, גלשן)',
        typeEn: 'Snowboard + Safety Gear (Helmet, Goggles, Boots, Board)',
        duration: '5 ימים',
        durationEn: '5 days',
        costEUR: 150, // Average for Austria
        link: 'https://www.intersportrent.com/' // Example link
    },
    accommodation: [
        {
            name: 'Sport & Spa Hotel Strass',
            rating: '4-star',
            dates: '2026-01-12 - 2026-01-19',
            costEUR: 800, // Cost per person for 7 nights
            notes: 'כולל חצי פנסיון, ספא מעולה ובריכה מחוממת, חיי לילה תוססים, מיקום מעולה ליד רכבל Penkenbahn.',
            notesEn: 'Includes Half Board, excellent spa & heated pool, lively nightlife, prime location next to Penkenbahn gondola.',
            link: 'https://www.booking.com/hotel/at/fun.html'
        },
        {
            name: 'Hotel St. Georg',
            rating: '4-star',
            dates: '2026-01-12 - 2026-01-19',
            costEUR: 700,
            notes: 'כולל חצי פנסיון, ספא טוב ובריכה מקורה, מיקום שקט יותר אך הליכה קצרה למעליות ולמרכז.',
            notesEn: 'Includes Half Board, good spa & indoor pool, quieter location but walkable to lifts/center.',
            link: 'https://www.booking.com/hotel/at/st-georg-mayrhofen.html'
        },
        {
            name: 'Hotel Neue Post',
            rating: '4-star',
            dates: '2026-01-12 - 2026-01-19',
            costEUR: 750,
            notes: 'כולל חצי פנסיון, בריכה מקורה נחמדה וספא, מיקום מרכזי.',
            notesEn: 'Includes Half Board, nice indoor pool & spa, central location.',
            link: 'https://www.booking.com/hotel/at/neue-post.html'
        },
    ],
    dailyExpenses: {
        costPerDayEUR: 50,
        totalCostEUR: 50 * 7, // 7 days
        notes: 'כולל ארוחת צהריים, שתיה והוצאות אישיות (מלבד חצי פנסיון במלון)',
        notesEn: 'Includes lunch, drinks, and personal expenses (excluding half-board at hotel)',
    },
};

// Data for Andorra (Pas de la Casa)
const andorraData = {
    flights: {
        departure: {
            date: '2026-01-12',
            time: '07:00',
            airline: 'אל-על',
            airlineEn: 'El Al',
            destination: 'ברצלונה (BCN)',
            destinationEn: 'Barcelona (BCN)',
            arrivalTime: '10:00',
        },
        return: {
            date: '2026-01-19',
            time: '11:00',
            airline: 'אל-על',
            airlineEn: 'El Al',
            destination: 'תל אביב (TLV)',
            destinationEn: 'Tel Aviv (TLV)',
            arrivalTime: '16:00',
        },
        costUSD: 350,
    },
    transfers: {
        costEUR: 102, // 110 USD / 1.08 EUR/USD = ~101.85 EUR
        provider: 'Andbus',
        providerEn: 'Andbus',
        notes: 'שאטל מברצלונה לפס דה לה קאסה',
        notesEn: 'Shuttle from Barcelona to Pas de la Casa',
        link: 'https://www.andorrabybus.com/en'
    },
    skiPass: {
        dates: '2026-01-13 - 2026-01-17',
        duration: '5 ימים',
        durationEn: '5 days',
        costPerDayEUR: 60,
        totalCostEUR: 300,
        link: 'https://www.grandvalira.com/en/skipass-rates'
    },
    equipment: {
        type: 'סנובורד + ציוד בטיחות (קסדה, משקפי סקי, נעליים, גלשן)',
        typeEn: 'Snowboard + Safety Gear (Helmet, Goggles, Boots, Board)',
        duration: '5 ימים',
        durationEn: '5 days',
        costEUR: 160, // Average for Andorra
        link: 'https://www.skiset.co.uk/ski-resort/pas-de-la-casa/ski-rental' // Example link
    },
    accommodation: [
        {
            name: 'Font D\'Argent Pas de la Casa',
            rating: '4-star',
            dates: '2026-01-12 - 2026-01-19',
            costEUR: 700,
            notes: 'כולל חצי פנסיון, ספא מעולה ובריכה מחוממת, חיי לילה תוססים, מיקום מעולה ליד מעליות.',
            notesEn: 'Includes Half Board, excellent spa & heated pool, lively nightlife, prime location next to lifts.',
            link: 'https://www.booking.com/hotel/ad/font-d-argent-pas-de-la-casa.he.html'
        },
        {
            name: 'Hotel Caribou',
            rating: '4-star',
            dates: '2026-01-12 - 2026-01-19',
            costEUR: 650,
            notes: 'כולל חצי פנסיון, ספא טוב ובריכה מקורה, תמורה טובה למחיר, מיקום מעולה.',
            notesEn: 'Includes Half Board, good spa & indoor pool, great value, excellent location.',
            link: 'https://www.booking.com/hotel/ad/caribou.he.html'
        },
        {
            name: 'Hotel Sporting',
            rating: '4-star',
            dates: '2026-01-12 - 2026-01-19',
            costEUR: 600,
            notes: 'כולל חצי פנסיון, ספא בסיסי, מיקום מושלם לחיי לילה ולמעליות.',
            notesEn: 'Includes Half Board, basic spa, perfect location for nightlife and lifts.',
            link: 'https://www.booking.com/hotel/ad/sporting.he.html'
        },
        {
            name: 'Hotel Cristina',
            rating: '3-star',
            dates: '2026-01-12 - 2026-01-19',
            costEUR: 450,
            notes: 'כולל חצי פנסיון, ללא בריכה/ספא, מיקום מעולה בתקציב נמוך.',
            notesEn: 'Includes Half Board, no pool/spa, excellent location for budget.',
            link: 'https://www.booking.com/hotel/ad/cristina.he.html'
        },
    ],
    dailyExpenses: {
        costPerDayEUR: 50,
        totalCostEUR: 50 * 7, // 7 days
        notes: 'כולל ארוחת צהריים, שתיה והוצאות אישיות (מלבד חצי פנסיון במלון)',
        notesEn: 'Includes lunch, drinks, and personal expenses (excluding half-board at hotel)',
    },
    additionalNotes: {
        he: 'ניתן לשלב לינה של לילה או שניים בברצלונה. ההשפעה על המחיר הכולל היא מינורית (אומדן של ₪200 לכאן או לכאן).',
        en: 'It is possible to combine a one or two-night stay in Barcelona. The impact on the total price is minor (an estimate of ±₪200).'
    }
};

const App = () => {
    const [selectedDestination, setSelectedDestination] = useState(null); // 'andorra' or 'austria'
    const [language, setLanguage] = useState('he'); // 'he' for Hebrew, 'en' for English

    const toggleLanguage = () => {
        setLanguage(prevLang => (prevLang === 'he' ? 'en' : 'he'));
    };

    const isHebrew = language === 'he';
    const direction = isHebrew ? 'rtl' : 'ltr';

    const renderText = (heText, enText) => (isHebrew ? heText : enText);

const calculateTotalCost = (data, selectedAccommodationCostEUR) => {
    const flightsCostUSD = data.flights.costUSD;
    const transfersCostUSD = data.transfers.costEUR * EUR_TO_USD;
    const skiPassCostUSD = data.skiPass.totalCostEUR * EUR_TO_USD;
    const equipmentCostUSD = data.equipment.costEUR * EUR_TO_USD;
    const dailyExpensesCostUSD = data.dailyExpenses.totalCostEUR * EUR_TO_USD;
    const accommodationCostUSD = selectedAccommodationCostEUR * EUR_TO_USD;

    const totalUSD = flightsCostUSD + transfersCostUSD + skiPassCostUSD + equipmentCostUSD + dailyExpensesCostUSD + accommodationCostUSD;
    const totalILS = totalUSD * USD_TO_ILS;

    return {
        totalUSD: Math.round(totalUSD), // עיגול הסכום הכולל בדולרים
        totalILS: Math.round(totalILS), // עיגול הסכום הכולל בשקלים
        flightsCostUSD: Math.round(flightsCostUSD), // עיגול עלות הטיסות
        transfersCostUSD: Math.round(transfersCostUSD), // עיגול עלות ההעברות
        skiPassCostUSD: Math.round(skiPassCostUSD), // עיגול עלות הסקי פס
        equipmentCostUSD: Math.round(equipmentCostUSD), // עיגול עלות ציוד הסקי
        dailyExpensesCostUSD: Math.round(dailyExpensesCostUSD), // עיגול עלות ההוצאות היומיות
        accommodationCostUSD: Math.round(accommodationCostUSD), // עיגול עלות הלינה
    };
};

const getAccommodationCosts = (accommodationList) => {
    return accommodationList.map(acc => {
        const costUSD = acc.costEUR * EUR_TO_USD;
        const costILS = acc.costEUR * EUR_TO_ILS;
        return { ...acc, costUSD: Math.round(costUSD), costILS: Math.round(costILS) }; // עיגול עלויות הלינה בדולרים ובשקלים
    });
};

    const currentData = selectedDestination === 'austria' ? mayrhofenData : andorraData;
    const accommodationOptions = currentData ? getAccommodationCosts(currentData.accommodation) : [];

    // State to hold the selected accommodation for total cost calculation
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);

    // Set default selected accommodation when destination changes
    useEffect(() => {
        if (currentData && currentData.accommodation.length > 0) {
            setSelectedAccommodation(currentData.accommodation[0]); // Select the first one by default
        } else {
            setSelectedAccommodation(null);
        }
    }, [selectedDestination, currentData]);

    const finalTotalCosts = selectedAccommodation
        ? calculateTotalCost(currentData, selectedAccommodation.costEUR)
        : { totalUSD: 0, totalILS: 0, flightsCostUSD: 0, transfersCostUSD: 0, skiPassCostUSD: 0, equipmentCostUSD: 0, dailyExpensesCostUSD: 0, accommodationCostUSD: 0 };

    return (
        <div className={`min-h-screen bg-gray-900 text-gray-100 font-inter p-4 md:p-8 ${direction}`}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700&display=swap');
                body { font-family: 'Rubik', sans-serif; } /* Changed font to Rubik */
                .rtl { direction: rtl; text-align: right; }
                .ltr { direction: ltr; text-align: left; }
                `}
            </style>

            {/* Header */}
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-green-700">
                <h1 className="text-3xl md:text-4xl font-bold text-green-400">
                    {renderText("הבריחה שלנו מפרס", "yalla lets ski away from Peres")}
                </h1>
                <button
                    onClick={toggleLanguage}
                    className="px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                >
                    {renderText("English", "עברית")}
                </button>
            </header>

            {/* Destination Selection */}
            <section className="mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-green-300">
                    {renderText("בחר יעד:", "Select Destination:")}
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={() => setSelectedDestination('andorra')}
                        className={`flex-1 px-6 py-4 rounded-xl shadow-lg transition duration-300 ease-in-out
                            ${selectedDestination === 'andorra' ? 'bg-green-600 text-white' : 'bg-gray-800 text-green-300 hover:bg-gray-700'}
                            font-bold text-xl`}
                    >
                        {renderText("אנדורה", "Andorra")}
                    </button>
                    <button
                        onClick={() => setSelectedDestination('austria')}
                        className={`flex-1 px-6 py-4 rounded-xl shadow-lg transition duration-300 ease-in-out
                            ${selectedDestination === 'austria' ? 'bg-green-600 text-white' : 'bg-gray-800 text-green-300 hover:bg-gray-700'}
                            font-bold text-xl`}
                    >
                        {renderText("אוסטריה", "Austria")}
                    </button>
                </div>
            </section>

            {/* Trip Details */}
            {selectedDestination && (
                <section className="bg-gray-800 p-6 md:p-10 rounded-xl shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-green-300">
                        {renderText(
                            `פרטי הטיול - ${renderText(selectedDestination === 'austria' ? 'אוסטריה' : 'אנדורה', selectedDestination === 'austria' ? 'Austria' : 'Andorra')}`,
                            `Trip Details - ${selectedDestination === 'austria' ? 'Austria' : 'Andorra'}`
                        )}
                    </h2>

                    {/* Flights */}
                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h3 className="text-xl md:text-2xl font-bold text-green-200 mb-4 flex items-center gap-2">
                            <Plane className="text-green-400" size={24} /> {renderText("טיסות", "Flights")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                            <div>
                                <p><CalendarDays className="inline-block mr-2" size={18} />{renderText("תאריך יציאה:", "Departure Date:")} {currentData.flights.departure.date}</p>
                                <p><Clock className="inline-block mr-2" size={18} />{renderText("שעת המראה:", "Departure Time:")} {currentData.flights.departure.time}</p>
                                <p><Building className="inline-block mr-2" size={18} />{renderText("חברת תעופה:", "Airline:")} {renderText(currentData.flights.departure.airline, currentData.flights.departure.airlineEn || currentData.flights.departure.airline)}</p>
                                <p><MapPin className="inline-block mr-2" size={18} />{renderText("יעד:", "Destination:")} {renderText(currentData.flights.departure.destination, currentData.flights.departure.destinationEn || currentData.flights.departure.destination)}</p>
                                <p><Clock className="inline-block mr-2" size={18} />{renderText("שעת נחיתה משוערת:", "Estimated Arrival Time:")} {currentData.flights.departure.arrivalTime}</p>
                                {currentData.flights.departure.notes && (
                                    <p className="text-sm text-gray-400 flex items-start gap-1 mt-2">
                                        <Info size={16} className="text-blue-300 mt-1" /> {renderText(currentData.flights.departure.notes, currentData.flights.departure.notesEn)}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p><CalendarDays className="inline-block mr-2" size={18} />{renderText("תאריך חזרה:", "Return Date:")} {currentData.flights.return.date}</p>
                                <p><Clock className="inline-block mr-2" size={18} />{renderText("שעת המראה:", "Departure Time:")} {currentData.flights.return.time}</p>
                                <p><Building className="inline-block mr-2" size={18} />{renderText("חברת תעופה:", "Airline:")} {renderText(currentData.flights.return.airline, currentData.flights.return.airlineEn || currentData.flights.return.airline)}</p>
                                <p><MapPin className="inline-block mr-2" size={18} />{renderText("יעד:", "Destination:")} {renderText(currentData.flights.return.destination, currentData.flights.return.destinationEn || currentData.flights.return.destination)}</p>
                                <p><Clock className="inline-block mr-2" size={18} />{renderText("שעת נחיתה משוערת:", "Estimated Arrival Time:")} {currentData.flights.return.arrivalTime}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-xl font-bold text-green-300">
                            {renderText("עלות טיסות לאדם (הלוך ושוב):", "Flight Cost per Person (Round Trip):")} ${currentData.flights.costUSD} / {renderText("₪", "₪")}{Math.round(currentData.flights.costUSD * USD_TO_ILS)}
                        </p>
                    </div>

                    {/* Transfers */}
                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h3 className="text-xl md:text-2xl font-bold text-green-200 mb-4 flex items-center gap-2">
                            <Bus className="text-green-400" size={24} /> {renderText("העברות", "Transfers")}
                        </h3>
                        <p className="text-lg">{renderText("אמצעי העברה:", "Transfer Method:")} {renderText(currentData.transfers.provider, currentData.transfers.providerEn)}</p>
                        <p className="text-lg flex items-start gap-1">
                            <Info size={16} className="text-blue-300 mt-1" /> {renderText(currentData.transfers.notes, currentData.transfers.notesEn)}
                        </p>
                        <p className="mt-4 text-xl font-bold text-green-300">
                            {renderText("עלות העברה לאדם:", "Transfer Cost per Person:")} €{currentData.transfers.costEUR} / ${ Math.round(currentData.transfers.costEUR * EUR_TO_USD)} / {renderText("₪", "₪")}{Math.round(currentData.transfers.costEUR * EUR_TO_ILS)}
                            {currentData.transfers.link && (
                                <a href={currentData.transfers.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline ml-2 text-base">
                                    ({renderText("קישור", "Link")})
                                </a>
                            )}
                        </p>
                    </div>

                    {/* Ski Pass */}
                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h3 className="text-xl md:text-2xl font-bold text-green-200 mb-4 flex items-center gap-2">
                            <Snowflake className="text-green-400" size={24} /> {renderText("סקי פס", "Ski Pass")}
                        </h3>
                        <p className="text-lg">{renderText("תאריכים:", "Dates:")} {currentData.skiPass.dates}</p>
                        <p className="text-lg">{renderText("משך:", "Duration:")} {renderText(currentData.skiPass.duration, currentData.skiPass.durationEn)}</p>
                        <p className="text-lg">{renderText("מחיר ליום:", "Cost per Day:")} €{currentData.skiPass.costPerDayEUR}</p>
                        <p className="mt-4 text-xl font-bold text-green-300">
                            {renderText("סה\"כ מחיר סקי פס לאדם:", "Total Ski Pass Cost per Person:")} €{currentData.skiPass.totalCostEUR} / ${ Math.round(currentData.skiPass.totalCostEUR * EUR_TO_USD)} / {renderText("₪", "₪")}{Math.round(currentData.skiPass.totalCostEUR * EUR_TO_ILS)}
                            {currentData.skiPass.link && (
                                <a href={currentData.skiPass.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline ml-2 text-base">
                                    ({renderText("קישור", "Link")})
                                </a>
                            )}
                        </p>
                    </div>

                    {/* Equipment Rental */}
                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h3 className="text-xl md:text-2xl font-bold text-green-200 mb-4 flex items-center gap-2">
                            <ShoppingBag className="text-green-400" size={24} /> {renderText("השכרת ציוד סקי", "Ski Equipment Rental")}
                        </h3>
                        <p className="text-lg">{renderText("סוג ציוד:", "Equipment Type:")} {renderText(currentData.equipment.type, currentData.equipment.typeEn)}</p>
                        <p className="text-lg">{renderText("משך:", "Duration:")} {renderText(currentData.equipment.duration, currentData.equipment.durationEn)}</p>
                        <p className="mt-4 text-xl font-bold text-green-300">
                            {renderText("עלות השכרה לאדם:", "Rental Cost per Person:")} €{currentData.equipment.costEUR} / ${ Math.round(currentData.equipment.costEUR * EUR_TO_USD)} / {renderText("₪", "₪")}{Math.round(currentData.equipment.costEUR * EUR_TO_ILS)}
                            {currentData.equipment.link && (
                                <a href={currentData.equipment.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline ml-2 text-base">
                                    ({renderText("קישור", "Link")})
                                </a>
                            )}
                        </p>
                    </div>

                    {/* Accommodation */}
                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h3 className="text-xl md:text-2xl font-bold text-green-200 mb-4 flex items-center gap-2">
                            <Hotel className="text-green-400" size={24} /> {renderText("לינה (7 לילות)", "Accommodation (7 Nights)")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {accommodationOptions.map((hotel, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition duration-300 ease-in-out
                                        ${selectedAccommodation && selectedAccommodation.name === hotel.name ? 'border-green-400 bg-gray-600' : 'border-gray-600 hover:bg-gray-700'}
                                    `}
                                    onClick={() => setSelectedAccommodation(hotel)}
                                >
                                    <h4 className="font-semibold text-lg text-green-100">{hotel.name}</h4>
                                    <p className="text-sm text-gray-400 flex items-center gap-1"><Star size={16} className="text-yellow-400" /> {hotel.rating}</p>
                                    <p className="text-sm text-gray-400 flex items-center gap-1"><CalendarDays size={16} /> {hotel.dates}</p>
                                    <p className="text-base font-bold text-green-300 mt-2">
                                        {renderText("עלות כוללת (לאדם):", "Total Cost (per person):")} €{hotel.costEUR} / ${hotel.costUSD} / {renderText("₪", "₪")}{hotel.costILS}
                                    </p>
                                    <p className="text-sm text-gray-300 flex items-start gap-1 mt-2">
                                        <Info size={16} className="text-blue-300 mt-1" /> {renderText(hotel.notes, hotel.notesEn)}
                                    </p>
                                    {hotel.link && (
                                        <a href={hotel.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline text-sm mt-2 block">
                                            {renderText("לפרטים והזמנה", "View Details & Book")}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                        {selectedAccommodation && (
                            <p className="mt-6 text-xl font-bold text-green-300">
                                {renderText("מלון נבחר לחישוב סופי:", "Selected Hotel for Final Calculation:")} {selectedAccommodation.name}
                            </p>
                        )}
                    </div>

                    {/* Daily Expenses */}
                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h3 className="text-xl md:text-2xl font-bold text-green-200 mb-4 flex items-center gap-2">
                            <Utensils className="text-green-400" size={24} /> {renderText("הוצאות יומיות (מזון, שתיה, אישיות)", "Daily Expenses (Food, Drinks, Personal)")}
                        </h3>
                        <p className="text-lg">{renderText("עלות משוערת ליום:", "Estimated Cost per Day:")} €{currentData.dailyExpenses.costPerDayEUR}</p>
                        <p className="text-lg flex items-start gap-1">
                            <Info size={16} className="text-blue-300 mt-1" /> {renderText(currentData.dailyExpenses.notes, currentData.dailyExpenses.notesEn)}
                        </p>
                        <p className="mt-4 text-xl font-bold text-green-300">
                            {renderText("סה\"כ הוצאות יומיות לאדם (7 ימים):", "Total Daily Expenses per Person (7 days):")} €{currentData.dailyExpenses.totalCostEUR} / ${ Math.round(currentData.dailyExpenses.totalCostEUR * EUR_TO_USD)} / {renderText("₪", "₪")}{Math.round(currentData.dailyExpenses.totalCostEUR * EUR_TO_ILS)}
                        </p>
                    </div>

                    {/* Additional Notes for Andorra */}
                    {selectedDestination === 'andorra' && currentData.additionalNotes && (
                        <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                            <h3 className="text-xl md:text-2xl font-bold text-green-200 mb-4 flex items-center gap-2">
                                <Info className="text-green-400" size={24} /> {renderText("הערות נוספות", "Additional Notes")}
                            </h3>
                            <p className="text-lg text-gray-300">
                                {renderText(currentData.additionalNotes.he, currentData.additionalNotes.en)}
                            </p>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="p-6 bg-green-800 rounded-lg shadow-inner">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <DollarSign className="text-white" size={24} /> {renderText("סיכום הוצאות מפורט (לאדם)", "Detailed Estimated Expenses (per person)")}
                        </h3>
                        <div className="text-lg mb-4">
                            <p className="mb-1">{renderText("טיסות:", "Flights:")} ${finalTotalCosts.flightsCostUSD} / {renderText("₪", "₪")}{finalTotalCosts.flightsCostUSD * USD_TO_ILS}</p>
                            <p className="mb-1">{renderText("העברות:", "Transfers:")} ${finalTotalCosts.transfersCostUSD} / {renderText("₪", "₪")}{finalTotalCosts.transfersCostUSD * USD_TO_ILS}</p>
                            <p className="mb-1">{renderText("סקי פס:", "Ski Pass:")} ${finalTotalCosts.skiPassCostUSD} / {renderText("₪", "₪")}{finalTotalCosts.skiPassCostUSD * USD_TO_ILS}</p>
                            <p className="mb-1">{renderText("השכרת ציוד סקי:", "Ski Equipment Rental:")} ${finalTotalCosts.equipmentCostUSD} / {renderText("₪", "₪")}{finalTotalCosts.equipmentCostUSD * USD_TO_ILS}</p>
                            <p className="mb-1">{renderText("לינה (מלון נבחר):", "Accommodation (Selected Hotel):")} ${finalTotalCosts.accommodationCostUSD} / {renderText("₪", "₪")}{finalTotalCosts.accommodationCostUSD * USD_TO_ILS}</p>
                            <p className="mb-1">{renderText("הוצאות יומיות (מזון, שתיה, אישיות):", "Daily Expenses (Food, Drinks, Personal):")} ${finalTotalCosts.dailyExpensesCostUSD} / {renderText("₪", "₪")}{finalTotalCosts.dailyExpensesCostUSD * USD_TO_ILS}</p>
                        </div>
                        <p className="text-2xl font-extrabold text-white mt-4">
                            {renderText("סה\"כ כולל לאדם:", "Grand Total per Person:")} ${finalTotalCosts.totalUSD} / {renderText("₪", "₪")}{finalTotalCosts.totalILS}
                        </p>
                        <p className="text-sm text-green-200 mt-2">
                            {renderText("*הערכה בלבד, המחירים עשויים להשתנות. מבוסס על מלון נבחר.", "*Estimate only, prices may vary. Based on selected hotel.")}
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
};

export default App;