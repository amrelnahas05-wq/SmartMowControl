# SmartMow Android App

  **DA3POLES™ SmartMow** — Android controller app for the autonomous ESP32-powered lawn mower.

  Built with **Expo / React Native / TypeScript**.

  ## Screens

  ### Home
  - Hero section matching [smartmow-woad.vercel.app](https://smartmow-woad.vercel.app/)
  - Live stats: Range 100M · Coverage 500M² · Runtime 6 HRS
  - Key features grid with icons

  ### Control Panel
  - WiFi connection to ESP32 (default IP: `192.168.4.1`)
  - **Live Status Dashboard** (polls every 3s):
    - Battery % with color-coded bar
    - Blade RPM (warns above 2,500)
    - Motor temperature (warns above 70°C)
    - WiFi signal strength
    - Session time, area covered
    - Mow status: IDLE / MOWING / RETURNING / CHARGING / ERROR
  - Directional D-pad (hold to drive, auto-repeat)
  - Mode selector: AUTO / MANUAL / RETURN
  - Speed control (10–100%)
  - Blade motor toggle

  ### Features / Specs / Safety
  - Tabbed view with full technical specs
  - Safety protocol list

  ### Team & Roadmap
  - Project team profiles
  - 4-phase development roadmap with status indicators

  ## ESP32 API
  ```
  GET http://<IP>/cmd?action=<forward|backward|left|right|stop>&speed=<0-100>
  GET http://<IP>/status
    → { battery, blade_rpm, motor_temp, wifi_rssi, status, session_mins, area_covered }
  ```

  ## Theme
  Dark forest green (`#071a07`) background · Gold (`#c8a000`) accents · White text

  ---
  Built by **DA3POLES™** · SmartMow v1.0
  