# ConcertBuds &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matthewvilaysack/concertbuds/blob/main/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/matthewvilaysack/concertbuds/pulls)

ConcertBuds is a mobile app designed to connect concert-goers with similar music tastes to share commutes and make attending live performances a more social and sustainable experience.

* **Social Connections**: Meet fellow concert-goers taking similar routes to the venue.
* **Shared Commutes**: Plan meetups, share rides, and start the party during your commute.
* **Community Building**: Foster real-life interactions and reduce isolation for solo concert-goers.

## Inspiration
ConcertBuds was inspired by the need to enhance the social experience of live music events. Many solo concert-goers struggle to find companions for concerts, making the experience less enjoyable. By connecting people through shared commutes, ConcertBuds makes attending concerts more fun, safe, and sustainable.

## What it does
ConcertBuds allows users to:
- Search and RSVP to concerts.
- View and connect with others attending the same event.
- Plan shared commutes with other attendees using public transportation.

## How we built it
ConcertBuds was developed using:
- **React Native**: For a cross-platform mobile app.
- **Supabase**: For authentication, user profiles, and chat storage.
- **Google Maps API**: To plan and display routes to concert venues.
- **Ticketmaster API**: To fetch concert details.

## Setup Instructions

To set up ConcertBuds locally:
1. Clone the repository:
   ```
   git clone https://github.com/matthewvilaysack/concertbuds.git
   cd concertbuds
   ```
2. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```
3. Set up API keys:
   - Create a [Ticketmaster API key](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/).
   - Create a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key).
   - Add these keys to your `.env` file:
     ```
     REACT_APP_TICKETMASTER_API_KEY=your_ticketmaster_api_key
     REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```

4. Configure Supabase:
   - Set up a Supabase project.
   - Ensure your Supabase database matches the schema in the provided layout (refer to the attached database schema screenshot).
   - Add the Supabase credentials to your `.env` file:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. Run the app:
   ```
   npm start
   ```

## Demo and Website
- **Demo Video**: [Watch on YouTube](https://www.youtube.com/watch?v=Fqpg8nmeKhM)
- **Website**: [ConcertBuds](https://web.stanford.edu/class/cs147/projects/Designing-for-Movement/ConcertBuds/)

## Challenges & Issues
- Balancing privacy and safety with the need for social interaction
- Optimizing the commute-matching algorithm for shared transportation

## Possible Future Features
- **Enhanced Matching**: AI-powered algorithms for better user matching.
- **Safety Features**: Integrating reporting and moderation tools.
- **Expanded Features**: Adding a BuddyChat feature and past concert highlights.

### License
ConcertBuds is [MIT licensed](./LICENSE).
