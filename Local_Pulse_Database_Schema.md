# Local Pulse Database Schema

This document outlines a potential database schema for storing and managing Local Pulse data. This schema is designed to support both real-time API data and historical information for analytics and fallback scenarios.

## Database Technology Recommendations

For a production implementation, we recommend:

- **Primary Database**: PostgreSQL for relational data
- **Cache Layer**: Redis for fast access to frequently accessed data
- **Time-Series Data**: InfluxDB or TimescaleDB for historical trends and analytics
- **Document Store**: MongoDB for unstructured data like reviews and tips

## Core Schema (PostgreSQL)

### 1. Locations Table

```sql
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    population INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_locations_country ON locations(country_code);
CREATE INDEX idx_locations_coords ON locations(latitude, longitude);
```

### 2. Weather Data

```sql
CREATE TABLE weather_data (
    weather_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    temperature DECIMAL(5, 2) NOT NULL,
    temperature_unit CHAR(1) DEFAULT 'C',
    condition VARCHAR(50) NOT NULL,
    icon_code VARCHAR(50) NOT NULL,
    humidity INTEGER,
    wind_speed DECIMAL(5, 2),
    precipitation_chance INTEGER,
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    forecast_for TIMESTAMP WITH TIME ZONE,
    source VARCHAR(50) NOT NULL,
    UNIQUE(location_id, forecast_for)
);

CREATE INDEX idx_weather_location_time ON weather_data(location_id, forecast_for);
```

### 3. Weather Moods

```sql
CREATE TABLE weather_moods (
    mood_id SERIAL PRIMARY KEY,
    condition VARCHAR(50) NOT NULL,
    temperature_min INTEGER,
    temperature_max INTEGER,
    time_of_day VARCHAR(20), -- morning, afternoon, evening, night
    season VARCHAR(20),     -- spring, summer, fall, winter
    description TEXT NOT NULL,
    suggested_activities TEXT[]
);

CREATE INDEX idx_weather_moods_condition ON weather_moods(condition);
CREATE INDEX idx_weather_moods_temp ON weather_moods(temperature_min, temperature_max);
```

### 4. Events

```sql
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    venue VARCHAR(200),
    venue_address TEXT,
    venue_latitude DECIMAL(10, 8),
    venue_longitude DECIMAL(11, 8),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    price_range VARCHAR(50),
    currency CHAR(3),
    ticket_url TEXT,
    image_url TEXT,
    source VARCHAR(50) NOT NULL,
    source_id VARCHAR(100) NOT NULL,
    attending_count INTEGER DEFAULT 0,
    interested_count INTEGER DEFAULT 0,
    is_popular BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_location ON events(location_id);
CREATE INDEX idx_events_time ON events(start_time);
CREATE INDEX idx_events_popular ON events(is_popular);
CREATE INDEX idx_events_category ON events(category, subcategory);
```

### 5. Sentiment Analysis

```sql
CREATE TABLE sentiment_data (
    sentiment_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    score INTEGER NOT NULL, -- 0-100 scale
    sample_size INTEGER NOT NULL,
    summary TEXT,
    dominant_emotion VARCHAR(50),
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sentiment_location ON sentiment_data(location_id);
CREATE INDEX idx_sentiment_time ON sentiment_data(retrieved_at);
```

### 6. Trending Hashtags

```sql
CREATE TABLE trending_hashtags (
    hashtag_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    hashtag VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL,
    sentiment_score INTEGER, -- -100 to 100 scale
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hashtags_location ON trending_hashtags(location_id);
CREATE INDEX idx_hashtags_time ON trending_hashtags(retrieved_at);
CREATE INDEX idx_hashtags_popularity ON trending_hashtags(count);
```

### 7. Crowd Density

```sql
CREATE TABLE crowd_density (
    density_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    area_type VARCHAR(50) NOT NULL, -- tourist, shopping, dining, parks, etc.
    area_name VARCHAR(100),
    density_level VARCHAR(20) NOT NULL, -- low, moderate, high
    density_score INTEGER NOT NULL, -- 0-100 scale
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crowd_location ON crowd_density(location_id);
CREATE INDEX idx_crowd_area ON crowd_density(area_type);
CREATE INDEX idx_crowd_time ON crowd_density(retrieved_at);
```

### 8. News Articles

```sql
CREATE TABLE news_articles (
    article_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    source_url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT,
    category VARCHAR(50),
    relevance_score INTEGER, -- 0-100 scale for traveler relevance
    sentiment_score INTEGER -- -100 to 100 scale
);

CREATE INDEX idx_news_location ON news_articles(location_id);
CREATE INDEX idx_news_published ON news_articles(published_at);
CREATE INDEX idx_news_relevance ON news_articles(relevance_score);
```

### 9. Music Trends

```sql
CREATE TABLE music_trends (
    trend_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    track_name VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    album_name VARCHAR(255),
    genre VARCHAR(100),
    popularity_score INTEGER NOT NULL, -- 0-100 scale
    play_count INTEGER,
    image_url TEXT,
    preview_url TEXT,
    external_url TEXT,
    source VARCHAR(50) NOT NULL,
    source_id VARCHAR(100),
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_music_location ON music_trends(location_id);
CREATE INDEX idx_music_popularity ON music_trends(popularity_score);
CREATE INDEX idx_music_time ON music_trends(retrieved_at);
```

### 10. Local Tips

```sql
CREATE TABLE local_tips (
    tip_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    tip_text TEXT NOT NULL,
    author_name VARCHAR(100),
    author_type VARCHAR(50), -- local, traveler, guide, AI
    category VARCHAR(50), -- dining, sightseeing, transport, safety, etc.
    vote_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_tips_location ON local_tips(location_id);
CREATE INDEX idx_tips_category ON local_tips(category);
CREATE INDEX idx_tips_votes ON local_tips(vote_count);
```

## Redis Cache Schema

The following Redis structures would be used for caching frequently accessed data:

### Weather Cache (Hash)
```
Key: weather:{location_id}
Fields:
  - temperature
  - condition
  - icon_code
  - description
  - activities (JSON array)
  - updated_at
  - expires_at
```

### Events Cache (Sorted Set)
```
Key: events:{location_id}
Score: event_start_timestamp
Value: JSON string containing event details
```

### Vibe Cache (Hash)
```
Key: vibe:{location_id}
Fields:
  - sentiment_score
  - trending_hashtags (JSON array)
  - summary
  - updated_at
  - expires_at
```

### Crowd Cache (Hash)
```
Key: crowd:{location_id}
Fields:
  - tourist_areas (JSON with area names and levels)
  - shopping_areas (JSON with area names and levels)
  - dining_areas (JSON with area names and levels)
  - parks (JSON with area names and levels)
  - updated_at
  - expires_at
```

## Time-Series Data (InfluxDB/TimescaleDB)

For analyzing trends over time:

### Weather Metrics
```
Measurement: weather_metrics
Tags:
  - location_id
  - condition
Fields:
  - temperature
  - humidity
  - precipitation_chance
Timestamp: recorded_at
```

### Crowd Metrics
```
Measurement: crowd_metrics
Tags:
  - location_id
  - area_type
  - area_name
Fields:
  - density_level
  - density_score
Timestamp: recorded_at
```

### Sentiment Metrics
```
Measurement: sentiment_metrics
Tags:
  - location_id
Fields:
  - score
  - sample_size
  - dominant_emotion
Timestamp: recorded_at
```

## Document Store (MongoDB)

For storing more complex, unstructured data:

### Local Tips Collection
```json
{
  "_id": "ObjectId",
  "location_id": 123,
  "tip_text": "Visit the north side of the park for the best sunset views...",
  "author": {
    "name": "Jean",
    "type": "local",
    "verified": true,
    "profile_img": "https://example.com/profiles/jean.jpg",
    "years_in_location": 15
  },
  "category": "sightseeing",
  "subcategories": ["sunset", "park", "photography"],
  "coordinates": {
    "latitude": 48.856614,
    "longitude": 2.3522219
  },
  "created_at": "2023-06-15T14:30:00Z",
  "votes": {
    "helpful": 47,
    "not_helpful": 3
  },
  "media": [
    {
      "type": "image",
      "url": "https://example.com/tips/paris/sunset.jpg"
    }
  ],
  "is_active": true
}
```

### Expanded Reviews Collection
```json
{
  "_id": "ObjectId",
  "location_id": 123,
  "venue_id": 456,
  "venue_type": "restaurant",
  "venue_name": "Café Madeline",
  "rating": 4.8,
  "review_text": "The croissants are absolutely amazing...",
  "author": {
    "name": "Tourist123",
    "type": "traveler",
    "nationality": "US"
  },
  "visit_date": "2023-05-10",
  "created_at": "2023-05-15T08:45:00Z",
  "helpful_votes": 12,
  "tags": ["breakfast", "pastry", "coffee", "affordable"],
  "is_verified": true
}
```

## Data Retention and Archiving

Implement a data retention policy:

1. **Hot Data (Active Storage)**:
   - Current weather data: 2 days
   - Event data: Until event is over + 1 day
   - Sentiment analysis: 7 days
   - News articles: 14 days
   - Music trends: 30 days

2. **Warm Data (Aggregated Storage)**:
   - Monthly averages for weather, sentiment, crowds
   - Event summaries by month and category
   - Trending hashtags by month

3. **Cold Data (Archive)**:
   - Historical data older than the retention periods
   - Compressed and stored for analytics purposes

## Database Migration Path

1. **Initial Setup**: Start with PostgreSQL for core tables
2. **Scale Step 1**: Add Redis caching when traffic increases
3. **Scale Step 2**: Add time-series database for analytics
4. **Scale Step 3**: Move complex unstructured data to MongoDB
5. **Scale Step 4**: Shard databases by geographic region when necessary

## Backup Strategy

1. **Daily Full Backups**: Entire database
2. **Hourly Incremental Backups**: Changes since last backup
3. **Transaction Logs**: Continuous backup for point-in-time recovery
4. **Geo-Redundancy**: Backups stored in multiple regions 