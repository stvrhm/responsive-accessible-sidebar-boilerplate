document.addEventListener("DOMContentLoaded", () => {
	const leftSidebar = document.getElementById("left-sidebar");
	const rightSidebar = document.getElementById("right-sidebar");
	const leftTrigger = document.getElementById("left-sidebar-trigger");
	const rightTrigger = document.getElementById("right-sidebar-trigger");
	const mainContent = document.getElementById("main-content");
	const closeButtons = document.querySelectorAll(".close-btn");
	const rtlToggle = document.getElementById("rtl-toggle");

	const sidebars = {
		"left-sidebar": {
			element: leftSidebar,
			trigger: leftTrigger,
			isOpen: false,
		},
		"right-sidebar": {
			element: rightSidebar,
			trigger: rightTrigger,
			isOpen: false,
		},
	};

	// Focus trap variables
	let focusTrapActive = false;
	let firstFocusableElement = null;
	let lastFocusableElement = null;

	/**
	 * Gets all focusable elements within a container
	 * @param {HTMLElement} container - The container to search for focusable elements
	 * @returns {HTMLElement[]} Array of focusable elements
	 */
	function getFocusableElements(container) {
		const focusableSelectors = [
			"a[href]",
			"button:not([disabled])",
			"input:not([disabled])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			'[tabindex]:not([tabindex="-1"])',
			'[contenteditable="true"]',
		];

		return Array.from(
			container.querySelectorAll(focusableSelectors.join(", ")),
		).filter((el) => el.offsetParent !== null); // Only visible elements
	}

	/**
	 * Sets up focus trap for a sidebar
	 * @param {HTMLElement} sidebarElement - The sidebar element to trap focus in
	 */
	function setupFocusTrap(sidebarElement) {
		if (window.innerWidth >= 768) return; // Only on mobile

		const focusableElements = getFocusableElements(sidebarElement);
		if (focusableElements.length === 0) return;

		firstFocusableElement = focusableElements[0];
		lastFocusableElement = focusableElements[focusableElements.length - 1];

		// Focus the first element
		firstFocusableElement.focus();

		// Add keyboard event listener for focus trap
		const handleKeyDown = (e) => {
			if (e.key === "Tab") {
				if (e.shiftKey) {
					// Shift + Tab: move backwards
					if (document.activeElement === firstFocusableElement) {
						e.preventDefault();
						lastFocusableElement.focus();
					}
				} else {
					// Tab: move forwards
					if (document.activeElement === lastFocusableElement) {
						e.preventDefault();
						firstFocusableElement.focus();
					}
				}
			}
		};

		sidebarElement.addEventListener("keydown", handleKeyDown);
		focusTrapActive = true;

		// Store the event listener for cleanup
		sidebarElement._focusTrapHandler = handleKeyDown;
	}

	/**
	 * Makes all focusable elements within a sidebar unfocusable
	 * @param {HTMLElement} sidebarElement - The sidebar element to make unfocusable
	 */
	function makeSidebarUnfocusable(sidebarElement) {
		const focusableElements = getFocusableElements(sidebarElement);
		focusableElements.forEach((element) => {
			// Store original tabindex if it exists
			if (!element.hasAttribute("data-original-tabindex")) {
				const originalTabindex = element.getAttribute("tabindex");
				if (originalTabindex !== null) {
					element.setAttribute("data-original-tabindex", originalTabindex);
				}
			}
			// Set tabindex to -1 to make it unfocusable
			element.setAttribute("tabindex", "-1");
		});
	}

	/**
	 * Restores focusability to all elements within a sidebar
	 * @param {HTMLElement} sidebarElement - The sidebar element to make focusable again
	 */
	function makeSidebarFocusable(sidebarElement) {
		const focusableElements = getFocusableElements(sidebarElement);
		focusableElements.forEach((element) => {
			// Restore original tabindex if it existed
			if (element.hasAttribute("data-original-tabindex")) {
				const originalTabindex = element.getAttribute("data-original-tabindex");
				element.setAttribute("tabindex", originalTabindex);
				element.removeAttribute("data-original-tabindex");
			} else {
				// Remove tabindex attribute if it was -1 (default focusable behavior)
				element.removeAttribute("tabindex");
			}
		});
	}

	/**
	 * Removes focus trap from a sidebar
	 * @param {HTMLElement} sidebarElement - The sidebar element to remove focus trap from
	 */
	function removeFocusTrap(sidebarElement) {
		if (sidebarElement._focusTrapHandler) {
			sidebarElement.removeEventListener(
				"keydown",
				sidebarElement._focusTrapHandler,
			);
			delete sidebarElement._focusTrapHandler;
		}
		focusTrapActive = false;
		firstFocusableElement = null;
		lastFocusableElement = null;
	}

	/**
	 * Toggles a sidebar's visibility and manages ARIA attributes and focus.
	 * @param {string} id - The ID of the sidebar to toggle ('left-sidebar' or 'right-sidebar').
	 */
	function toggleSidebar(id) {
		const sidebar = sidebars[id];
		if (!sidebar) return;

		sidebar.isOpen = !sidebar.isOpen;
		const bodyClass = `${id}-open`;

		document.body.classList.toggle(bodyClass, sidebar.isOpen);
		sidebar.trigger.setAttribute("aria-expanded", sidebar.isOpen);
		sidebar.element.setAttribute("aria-hidden", !sidebar.isOpen);

		// Update aria-label based on state
		const isLeftSidebar = id === "left-sidebar";
		if (sidebar.isOpen) {
			sidebar.trigger.setAttribute(
				"aria-label",
				isLeftSidebar ? "Close support menu" : "Close table of contents",
			);
		} else {
			sidebar.trigger.setAttribute(
				"aria-label",
				isLeftSidebar ? "Open support menu" : "Open table of contents",
			);
		}

		// Add a general class for mobile overlay
		if (
			window.innerWidth < 768 &&
			(sidebars["left-sidebar"].isOpen || sidebars["right-sidebar"].isOpen)
		) {
			document.body.classList.add("sidebar-open");
		} else {
			document.body.classList.remove("sidebar-open");
		}

		if (sidebar.isOpen) {
			// Make sidebar focusable and set up focus trap for mobile
			makeSidebarFocusable(sidebar.element);
			setupFocusTrap(sidebar.element);
		} else {
			// Remove focus trap and make sidebar unfocusable
			removeFocusTrap(sidebar.element);
			makeSidebarUnfocusable(sidebar.element);
			// Return focus to the trigger button
			sidebar.trigger.focus();
		}
	}

	// Event Listeners for triggers
	if (leftTrigger) {
		leftTrigger.addEventListener("click", () => toggleSidebar("left-sidebar"));
	}
	if (rightTrigger) {
		rightTrigger.addEventListener("click", () =>
			toggleSidebar("right-sidebar"),
		);
	}

	// Event Listeners for close buttons
	closeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const sidebarId = button.getAttribute("data-sidebar-id");
			if (sidebarId && sidebars[sidebarId].isOpen) {
				toggleSidebar(sidebarId);
			}
		});
	});

	// Close sidebar with the Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			if (sidebars["left-sidebar"].isOpen) {
				toggleSidebar("left-sidebar");
			}
			if (sidebars["right-sidebar"].isOpen) {
				toggleSidebar("right-sidebar");
			}
		}
	});

	// RTL Toggle for demonstration
	if (rtlToggle) {
		rtlToggle.addEventListener("click", () => {
			const currentDir = document.documentElement.dir;
			document.documentElement.dir = currentDir === "rtl" ? "ltr" : "rtl";
		});
	}

	// Initialize sidebars as unfocusable since they start closed
	Object.values(sidebars).forEach((sidebar) => {
		makeSidebarUnfocusable(sidebar.element);
	});

	// Handle window resize to manage focus trap and prevent layout flashing
	let resizeTimeout;
	window.addEventListener("resize", () => {
		// Clear any existing timeout
		clearTimeout(resizeTimeout);

		// Add a small delay to prevent layout flashing during resize
		resizeTimeout = setTimeout(() => {
			// If screen becomes desktop size, remove focus traps
			if (window.innerWidth >= 768) {
				Object.values(sidebars).forEach((sidebar) => {
					if (sidebar.isOpen) {
						removeFocusTrap(sidebar.element);
					}
				});
			} else {
				// If screen becomes mobile size and sidebar is open, set up focus trap
				Object.values(sidebars).forEach((sidebar) => {
					if (sidebar.isOpen) {
						setupFocusTrap(sidebar.element);
					}
				});
			}
		}, 100); // Small delay to let CSS transitions settle
	});
});
