# OKAWE MEDIA - Content Update Guide

This guide explains how to add your own images and videos to your website.

---

## 1. Adding Local Videos (Hero Section)

### Step A: Place your file
Copy your video file (e.g., `my-video.mp4`) into the folder:  
`src/assets/videos/`

### Step B: Update the code
Open `src/components/Hero.js` and follow these steps:
1. At the top of the file, add this line:
   ```javascript
   import heroVideo from '../assets/videos/my-video.mp4';
   ```
2. Find the `<video>` tag and change the `<source>` line to:
   ```javascript
   <source src={heroVideo} type="video/mp4" />
   ```

---

## 2. Adding Local Images (Services Section)

### Step A: Place your file
Copy your images into the folder:  
`src/assets/images/`

### Step B: Update the code
Open `src/components/Services.js`:
1. Import the image at the top:
   ```javascript
   import myServiceImg from '../assets/images/service-1.jpg';
   ```
2. In the `mainServices` list, update the `img` property:
   ```javascript
   { 
     id: 'logo', 
     icon: '🎨', 
     img: myServiceImg // Use the imported name here
   },
   ```

---

## 3. Adding Portfolio Items (Images or YouTube)

Open `src/components/Portfolio.js`:

### For an Image:
Add a new item to the `portfolioItems` list:
```javascript
{ 
  id: 7, 
  category: 'branding', 
  title: 'My Project Name', 
  type: 'image', 
  url: 'https://link-to-image.jpg' // Or use a local import like step 2
}
```

### For a Video (YouTube/Vimeo):
1. Go to your video on YouTube.
2. Click **Share** > **Embed**.
3. Copy only the URL inside the `src="..."` (e.g., `https://www.youtube.com/embed/XXXXX`).
4. Add it to the list:
```javascript
{ 
  id: 8, 
  category: 'video', 
  title: 'My Video Title', 
  type: 'video', 
  url: 'https://www.youtube.com/embed/XXXXX' 
}
```

---

## 4. How to Update the Live Website
Every time you add new files or change code, you must run this command in your terminal to see the changes online:

```bash
npm run deploy
```

Wait 2-3 minutes, and your site at `https://ODY35.github.io/okawe-media-website` will be updated!
