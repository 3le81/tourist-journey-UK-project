# Tourism App - UK Tourist Journey

---

## Introduction

Tourism App is a collaborative project developed during my Web Development Course with Founders and Coders UK in 2024.  
The application leverages Google APIs to provide users with a comprehensive platform for planning tourist journeys within the UK.  
This README serves as a guide to understand the functionality, setup, and usage of the Tourism App.

---

![Homepage](/public/images/homepage.png)
![Distance](/public/images/distance-matrix.png)
![Places List](/public/images/places-list.png)

## Project Structure

The project follows a structured format comprising server-side and client-side components:

- **Server-Side:**
  - `server.js`: Implements server logic using Node.js and Express.
  - `package.json`: Contains project dependencies and configuration.
- **Client-Side:**
  - `public/`: Directory containing static web assets.
    - `index.html`: The main HTML file for the front end.
    - `styles.css`: CSS file for styling the web page.
  - `main.js`: Client-side JavaScript for dynamic content generation.

---

## Installation

To set up the Tourism App locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root directory and add your Google Maps API key:

   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

---

## Usage

Once installed, you can start using the Tourism App by following these steps:

1. Start the server:

   ```bash
   node server.js
   ```

2. Open a web browser and navigate to `http://localhost:3000`.

3. Enter your origin and destination to plan your route and explore tourist attractions along the way(_to be implemented_)

---

## Popup Message for More Information

The Tourism App includes a popup message feature that provides users with the option to obtain additional information about a specific tourist attraction or point of interest. When users click on a location marker or place name, a popup message dynamically appears, inviting users to learn more by clicking on it.

![Places List](/public/images/pop-up-message.png)

### Functionality

- **User Interaction**: Users can click on the popup message to access more detailed information about the selected location.

- **Information Prompt**: The popup message serves as a prompt, inviting users to engage further with the application and explore additional content.

### Purpose

The primary purpose of the popup message is to encourage user engagement and facilitate information discovery within the Tourism App. By providing a clear call-to-action, users are prompted to access more information about the places they are interested in exploring.

### Implementation

The popup message functionality is implemented using client-side JavaScript within the Tourism App. When a user interacts with a location marker or selects a place from the list, an event listener triggers the display of the popup message. Currently, the message prompts users to click for more information, with future updates planned to integrate personalized recommendations powered by OpenAI's language model.

## Accessibility

![Accessibility](/public/images/accessibility-lighthouse.png)

The Tourism App prioritizes accessibility to ensure that all users, including those with disabilities, can access and use the application. Here are some accessibility features implemented:

- **Semantic HTML Elements**: The application uses semantic HTML elements like `<nav>`, `<button>`, and `<section>` to provide clear structure and meaning for screen readers.
- **Descriptive Alt Attributes**: All images in the application have descriptive `alt` attributes that provide context and information about the image content. For example:

  ```html
  <img
    src="image.jpg"
    alt="Illustration of tourist attractions along the route"
  />
  ```

- **Color Contrast**: The color scheme of the application ensures sufficient contrast between text and background colors to enhance readability, adhering to WCAG guidelines.

- **Keyboard Navigation**: Users can navigate through the application using only keyboard inputs, ensuring accessibility for users who cannot use a mouse.

- **ARIA Labels and Roles**

ARIA labels and roles are used to enhance accessibility for assistive technologies. For example, interactive elements like buttons include an `aria-label` attribute:

```html
<button aria-label="Search for tourist attractions">Search</button>
```

The application has been tested using Lighthouse checks and achieves 100% compliance with accessibility standards.

---

## Endpoints

The Tourism App provides the following endpoints for interaction:

- **`/api/maps-api-key`**:
  - **Method:** GET
  - **Description:** Retrieves the Google Maps API key stored in environment variables.
- **`/calculate-route`**:
  - **Method:** POST
  - **Description:** Calculates the route between two locations using the Google Directions API.
- **`/api/places`**:
  - **Method:** GET
  - **Description:** Fetches nearby places based on location using the Google Places API.

---

## Client-Server Interaction

- The server serves the static web page and acts as an intermediary for API requests.
- Client-side JavaScript makes requests to server-side endpoints.
- The server fetches data from external APIs and returns it in JSON format.
- Client-side script dynamically updates the web page with the received data.

---

### The initial part of the project has been developed in collaboration with Jack and Oleg during the FAC course.

---

# Thank you for considering the project! 🧳🚗
