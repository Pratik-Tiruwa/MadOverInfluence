# Deployment & Domain Setup Guide for MadeOverInfluence

This guide provides step-by-step instructions to fix the deployment errors on Vercel (caused by the monorepo structure) and connect your custom domain from Hostinger.

## Part 1: Fixing the Vercel Deployment Error

The constant build errors occur because your project is a workspace (monorepo). Vercel is looking for the build output in the root folder, but your frontend code is inside `artifacts/moi-website` and outputs to `dist/public`. 

Follow these steps to configure Vercel correctly:

1. **Log in to Vercel** and select your project from the dashboard.
2. Go to the **Settings** tab in the top navigation.
3. Under the **General** section, update the following configurations:

   - **Root Directory:** Click "Edit" and set it to `artifacts/moi-website`. (This tells Vercel where your actual frontend code lives).
   - **Framework Preset:** Ensure this is set to **Vite**.
   - **Build Command:** Turn on the override toggle and type: 
     ```bash
     pnpm run build
     ```
   - **Output Directory:** Turn on the override toggle and type:
     ```bash
     dist/public
     ```
     *(This is the most critical step. Without it, Vercel looks for a folder named `dist`, but your `vite.config.ts` sends the build files to `dist/public`)*.

4. Scroll down and click **Save**.
5. Now, go back to the **Deployments** tab in the top menu.
6. Click the three dots (`...`) next to the most recently failed deployment and select **Redeploy**.

Your deployment should now pass successfully with a green checkmark! ✅

---

## Part 2: Connecting Your Hostinger Domain

Once your website is successfully deployed on Vercel, it's time to link your custom domain.

### Step 2.1: Add Domain in Vercel
1. In your Vercel Project Dashboard, go to **Settings** > **Domains**.
2. Type in your custom domain (e.g., `madeoverinfluence.com`) and click **Add**.
3. Vercel will attempt to connect and provide you with DNS records to update. You will typically see:
   - An **A Record** (e.g., pointing to `76.76.21.21`)
   - A **CNAME Record** (e.g., pointing to `cname.vercel-dns.com`)
   *(Keep this Vercel tab open so you can copy these values).*

### Step 2.2: Update DNS in Hostinger
1. Open a new browser tab and log into your **Hostinger Account**.
2. Go to the **Domains** section and select your domain name.
3. On the left sidebar, click on **DNS / Nameservers**.
4. You need to add/update the records provided by Vercel:

   **Add the A Record (For the root domain):**
   - **Type:** `A`
   - **Name:** `@` (or leave blank if `@` is not accepted)
   - **Points to:** `76.76.21.21` (Paste the exact IP Vercel gave you)
   - *Note: If there are any existing A Records for `@`, delete them to avoid conflicts.*

   **Add the CNAME Record (For the 'www' subdomain):**
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `cname.vercel-dns.com`

5. Click **Add Record** (or Save) for both.

### Step 2.3: Wait for DNS Propagation
DNS changes do not happen instantly. It usually takes anywhere from **5 to 30 minutes** for the internet to register the new connection. 

Go back to your Vercel tab. Once the DNS has propagated, Vercel will automatically verify the connection, display a **Valid** status (green checkmark), and generate a free SSL certificate (HTTPS) for your website. 

Your website will now be live on your custom domain! 🚀

---

## Part 3: Deploying Future Updates

One of the best things about Vercel is its **Continuous Deployment (CI/CD)**. Once you have connected your GitHub repository to your Vercel project, you don't need to manually click "Deploy" every time you make a change.

### How to update your live website:

1. **Make changes to your code** locally in your editor (VS Code, Cursor, etc.).
2. **Commit your changes** in Git:
   ```bash
   git add .
   git commit -m "feat: your update message"
   ```
3. **Push to GitHub**:
   ```bash
   git push
   ```

**That's it!** 

As soon as you run `git push`, Vercel is automatically notified by GitHub. 
Vercel will immediately start building your new code in the background. Within 1-2 minutes, your live website will be updated automatically. 

*Tip: You can always go to your Vercel Dashboard -> **Deployments** tab to watch the build progress live whenever you push new code.*
