// Root Value and Styles
const root = document.documentElement;
const root_styles = getComputedStyle(root);

// Set Image Carousel Element Constants
const track = document.querySelector('.image-carousel-track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let slides;

// Set Circular Morphing Grind Constants
const nodes = document.querySelectorAll('.data-node');

// <<<<<<<<<< WEBSITE OBSERVERS >>>>>>>>>>
// All Sections And Elements Being Watched
const visibleStates = {
	ImageCarouselContainer: false
}

// Observer Class Instance That Controls Elements When In View Vs. Out Of View
const sectionObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		const sectionId = entry.target.id;
		
		if (sectionId in visibleStates) {
			visibleStates[sectionId] = entry.isIntersecting;
		}
		if (sectionId === 'ImageCarouselContainer') {
			const opacity = entry.isIntersecting ? "1" : "0.3";
		}
	});
}, { threshold: 0.2 });

// Setting Elements To Observe
sectionObserver.observe(document.getElementById("ImageCarouselContainer"));

// <<<<<<<<<< IMAGE CAROUSEL JAVASCRIPT >>>>>>>>>>
const imageCarouselData =  [
	{title: "", description: "", image: "IMG_2151.jpeg"},
	{title: "", description: "", image: "IMG_2153.jpeg"},
	{title: "", description: "", image: "IMG_2483.jpeg"},
	{title: "", description: "", image: "IMG_8455.jpeg"},
	{title: "", description: "", image: "IMG_8489.jpeg"}
];

// Sets Image Carousel image index
let currentCarouselIndex = 2;

function getCurrentIndex() {
	const slides = document.querySelectorAll('.image-carousel-slide');
	
	if (!slides || slides.length === 0) return 0;
	
	const slide = slides[0];
	if (!slide) return 0;
	
	const slideWidth = slide.getBoundingClientRect().width;
	const trackStyle = getComputedStyle(track);
	const gap = parseFloat(trackStyle.gap) || 0;
	const paddingLeft = parseFloat(trackStyle.paddingLeft) || 0;
	
	const adjustedScroll = track.scrollLeft;
	
	return Math.round(adjustedScroll / (slideWidth + gap));
}

function initCarousel() {
	setupImageCarousel();
	slides = document.querySelectorAll('.image-carousel-slide');
	setupInfiniteCarousel();
}

function setupImageCarousel() {
	const imageCarouselTrack = document.querySelector('.image-carousel-track');
	
	if (!imageCarouselTrack) return;
	
	imageCarouselTrack.innerHTML = '';
	
	imageCarouselData.forEach(carouselImage => {
		const slide = document.createElement('div');
		slide.className = 'image-carousel-slide';
		
		const img = document.createElement('img');
		img.className = 'carousel-img';
		img.src = `assets/carousel-images/${carouselImage.image}`;
		img.alt = carouselImage.title;
		
		slide.appendChild(img);
		
		imageCarouselTrack.appendChild(slide);
	})
}

function setupInfiniteCarousel() {
	const currentSlides = document.querySelectorAll('.image-carousel-slide');
	if (currentSlides === 0) return;
	
	const firstClone = currentSlides[0].cloneNode(true);
	const secondClone = currentSlides[1].cloneNode(true);
	const lastClone = currentSlides[currentSlides.length - 1].cloneNode(true);
	const secondLastClone = currentSlides[currentSlides.length - 2].cloneNode(true);
	
	firstClone.classList.add('clone');
	lastClone.classList.add('clone');
	secondClone.classList.add('clone');
	secondLastClone.classList.add('clone');
	
	track.appendChild(firstClone);
	track.appendChild(secondClone);
	track.insertBefore(secondLastClone, slides[0])
	track.insertBefore(lastClone, slides[0]);
	
	track.style.scrollBehavior = 'auto';
	updateCarousel(2, true);
	
	setTimeout(() => {
		track.style.scrollBehavior = 'smooth';
	}, 50);
}

initCarousel();

function updateCarousel(targetIndex, silent = false) {
	const allSlides = track.querySelectorAll('.image-carousel-slide');
	
	if (!allSlides) {
		console.error("Slides not found");
		return;
	}

		
	console.log("Current Slide Index", targetIndex);
	
	if (silent) {
		track.classList.add('no-transition');
	}
	
	const trackWidth = track.offsetWidth;
	const targetSlide = allSlides[targetIndex];
	const slideWidth = targetSlide.offsetWidth;
	const slideLeft = targetSlide.offsetLeft;
	const scrollToPosition = slideLeft - (trackWidth / 2) + (slideWidth / 2);
	
	track.scrollTo({
		left: scrollToPosition,
		behavior: silent ? 'auto' : 'smooth'
	});
	
	if (silent) {
		void track.offsetWidth;
		setTimeout(() => {
			track.classList.remove('no-transition');
		}, 30);
	}
}

track.addEventListener('scroll', () => {
	const allSlides = track.querySelectorAll('.image-carousel-slide');
	const scrollPos = track.scrollLeft;
	const scrollWidth = track.scrollWidth;
	const clientWidth = track.clientWidth;
	
	/* console.log(`${scrollPos}`);*/
	
	if (scrollPos <= 0.6 * clientWidth) {
		track.style.scrollBehavior = 'auto';
		updateCarousel(allSlides.length - 3, true);
		track.style.scrollBehavior = 'smooth';
		return;
	}
	else if (scrollPos >= (scrollWidth - 1.5 * clientWidth) - 2) {
		track.style.scrollBehavior = 'auto';
		updateCarousel(2, true);
		track.style.scrollBehavior = 'smooth';
		return;
	}
	
	const trackCenter = track.scrollLeft + track.offsetWidth / 2;
	
	allSlides.forEach((slide, i) => {
		const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
		const distance = Math.abs(slideCenter - trackCenter)
		
		if (distance < slide.offsetWidth / 2) {
			slide.style.transform = 'scale(1)';
			slide.style.opacity = '1';
			
			currentCarouselIndex = i
		} else {
			slide.style.transform = 'scale(0.8)';
			slide.style.opacity = '0.5';
		}
	});
});

nextBtn.addEventListener('click', () => {
	updateCarousel(currentCarouselIndex + 1);
});

prevBtn.addEventListener('click', () => {
	updateCarousel(currentCarouselIndex - 1);
});

window.addEventListener('resize', () => {
	updateCarousel(currentCarouselIndex);
});

// <<<<<<<<<< Recognition Card Display >>>>>>>>>>

const leadershipData = [
	{
		name: "Josie",
		title: "President",
		image: "president.jpeg",
		responsibilities: "\"I help to lead discussions & meetings. I offer a creative mindset & feed back during our discussions.\"",
		goals: "\"My dream is to start my own special occasion and formal wear brand. I plan to intern with a fashion couture atelier (preferrably in Paris or NYC!)\""
	},
	{
		name: "Talan", 
		title: "Vice President - Membership", 
		image: "vp-membership1.jpeg",
		responsibilities: "\"My responsibility is to recruit other students into the club, helping more sudents feel welcomed, accomplished and whole.\"",
		goals: "\"Go to Bridgerland Technical College and get a certificate in Graphic Design and possibly get a degree. I'm set on Graphic Design as a career.\""
	},
	{
		name: "Emma",
		title: "Vice President - Membership",
		image: "vp-membership2.jpeg",
		responsibilities: "\"To be a mentor to younger members and look after them. As a leader, you do have more responsibilities and work, but personally, I think it's worth it.\"",
		goals: "\"My career goals are career goals are to become an interior or set designer. I love all things design- & architexture-wise!\""
	},
	{
		name: "Aunara",
		title: "Vice President - Fundraising",
		image: "vp-fundraising.jpeg",
		responsibilities: "",
		goals: ""
	},
	{
		name: "Emily",
		title: "Vice President - Star Events",
		image: "",
		responsibilities: "\"Leadership member over events.\"",
		goals: "\"Elementary Teacher.\""
	},
	{
		name: "Tana", 
		title: "Vice President - Service", 
		image: "vp-service.jpeg",
		responsibilities: "\"Assist with activities & membership.\"",
		goals: "\"Elementary Teacher.\""
	},
	{
		name: "Courtney", 
		title: "Vice President - Social Media",
		image: "",
		responsibilities: "\"I help plan, recruit, answer question, and being a friend to others.\"",
		goals: "\"A successful event planning business on the side while I pursue a full career in the medical field.\""
	},
];

function generateLeadership() {
	const track = document.querySelector('.recognition-track');
	
	if (!track) return;
	
	track.innerHTML = '';
	
	leadershipData.forEach(leader => {
		const card = document.createElement('div');
		card.className = 'recognition-card';

		card.innerHTML = `
			<div class="recognition-card-img-and-name">
				<img src="assets/leadership-portraits/${leader.image}" alt="${leader.name}">
				<h4 class="recognition-card-name">${leader.name}</h4>
			</div>
			<div class="card-details">
				<div class="extra-info">
					<p><strong>Responsibilities:</strong> ${leader.responsibilities}</p>
					<p><strong>Career Goals:</strong> ${leader.goals}</p>
				</div>
				<h5 class="recognition-card-title">${leader.title}</h5>
			</div>
		`;
		
		track.appendChild(card);
	})
}

document.addEventListener('DOMContentLoaded', generateLeadership);

function scrollRecognition(direction) {
	const track = document.querySelector('.recognition-track');
	
	const cardWidth = track.querySelector('.recognition-card').offsetWidth;
	
	const scrollDistance = (cardWidth + 20) * 1.2;
	
	track.scrollBy({
		left: direction * scrollDistance,
		behavior: 'smooth'
	});
}


// <<<<<<<<<< CIRCULAR MORPHING GRID JAVASCRIPT >>>>>>>>>>
const activitiesData = [
    { title: "Fall Leadership", content: "Kick off the year with our annual leadership rally and workshop series." },
    { title: "STAR Events", content: "Competitive events where members are recognized for proficiency and achievement in chapter and individual projects." },
    { title: "Community Service", content: "Join us for our monthly outreach programs at the local food bank and senior center." },
    { title: "Career Pathways", content: "Explore various career opportunities in Family and Consumer Sciences through guest speaker events." },
    { title: "State Convention", content: "Represent our chapter at the state level and network with members from across the region." },
    { title: "Member Recruitment", content: "Help us grow our family by participating in our 'Bring a Friend' social nights." },
    { title: "National Programs", content: "Dive into peer education programs like Power of One and Financial Fitness." },
    { title: "Scholarship Prep", content: "Workshops dedicated to helping seniors find and apply for FCS-related scholarships." },
    { title: "Chapter Meetings", content: "Stay informed and vote on important chapter decisions during our bi-weekly meetings." },
    { title: "Fundraising Gala", content: "Our biggest event of the year to support our competition travel funds." },
    { title: "Officer Training", content: "Specialized sessions for newly elected officers to develop their leadership skills." },
    { title: "Public Relations", content: "Learn how to manage our social media presence and promote FCCLA to the community." }
];

const fcclaRedShades = [
    "#e4002b", // Official FCCLA Red
    "#8b0000", // Dark Red
    "#b22222", // Firebrick
    "#ff4d4d", // Light Bright Red
    "#a52a2a", // Brownish Red
    "#dc143c", // Crimson
    "#ff0000", // Pure Red
    "#c04040", // Muted Rose
    "#990000", // Deep Crimson
    "#ff6666", // Pastel Red
    "#7d0000", // Blood Red
    "#e63946"  // Modern Watermelon Red
];

function expandNode(node) {
	const first = node.getBoundingClientRect();
	
	node.classList.add('active');
	const last = node.getBoundingClientRect();
	
	const deltaX = first.left - last.left;
	const deltaY = first.top - last.top;
	const deltaW = first.width / last.width;
	const deltaH = first.height / last.height;
	
	node.style.transition = 'none';
	node.style.transformOrigin = 'top left';
	node.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
	
	requestAnimationFrame(() => {
		node.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s';
		node.style.transform = '';
	});
	
	document.body.classList.add('overlay-active');
	
	const closeBtn = node.querySelector('.close-node-btn');
	if (closeBtn) {
		closeBtn.onclick = (e) => {
			e.stopPropagation();
			closeActiveNode();
		}
	}
}

function closeActiveNode() {
	const activeNode = document.querySelector('.data-node.active');
		
	// Checks if activeNode Exists
	if (activeNode) {
		// If Escape Key Pressed And Active Node Exists:
		//		Undo classes and attributes previously applied 
		//		by the Circular Morphing Grid
		
		const first = activeNode.getBoundingClientRect();
		
		activeNode.classList.remove('active'); // Removes the active node class (active node no longer exists)
		
		document.body.classList.remove('overlay-active'); // Removes the overlay of the body used
		
		const last = activeNode.getBoundingClientRect();
		
		const deltaX = first.left - last.left;
		const deltaY = first.top - last.top;
		const deltaW = first.width / last.width;
		const deltaH = first.height / last.height;
		
		// Reset inline styles used for positioning and transition animation
		activeNode.style.transition = 'none';
		activeNode.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
		
		requestAnimationFrame(() => {
			activeNode.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
			activeNode.style.transform = '';
		});
	}
}

function generateNodes(data, containerId) {
	const container = document.getElementById(`${containerId}`)
	if (!container) return;
	
	container.innerHTML = '';
	let lastColorIndex = -1;
	
	data.forEach(item => {
		const node = document.createElement('div');
		node.classList.add('data-node');
		
		let randomIndex;
		do {
			randomIndex = Math.floor(Math.random() * fcclaRedShades.length);
		} while (randomIndex === lastColorIndex);
		
		lastColorIndex = randomIndex;
		node.style.backgroundColor = fcclaRedShades[randomIndex];
		
		const content = document.createElement('div');
		content.className = 'node-content';
		content.innerHTML = `
			<h2>${item.title}</h2>
			<p>${item.content}</p>
			<button class="close-node-btn">Close</button>
		`;
		
		node.appendChild(content);
		
		node.addEventListener('click', function(e) {
			if (this.classList.contains('active')) return;
			expandNode(this);
		});
		
		container.appendChild(node);
	});
}

generateNodes(activitiesData, 'activities-grid');

// generateNodes(retentionActivitiesData, 'FCCLARetentionActivitesContainer');

// <<<<<<<<<< KEYBOARD CONTROLS >>>>>>>>>>
window.addEventListener('keydown', (e) => {
	// Right Arrow Key Controls
	if (visibleStates.ImageCarouselContainer) {
		if (e.key === "ArrowRight") {
			e.preventDefault();
			nextBtn.click();
		}
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			prevBtn.click();
		}
	}
	
	// Escape Key Controls
	if (e.key === "Escape") {
		closeActiveNode();
	}

});


