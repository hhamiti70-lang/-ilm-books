# ILM Books — Starter project

**Brand:** ILM Books  
**Arabic inspiration:** عِلْم (ʿilm) means knowledge.  
**Tagline:** Knowledge Without Borders.  
**Palette:** forest green, gold and ivory.

## What this starter includes
- Responsive homepage with the selected brand identity.
- Demo book cards, category browsing and search/filter controls.
- Mobile navigation and a newsletter placeholder.
- Initial Supabase SQL schema for profiles, authors, books, purchases and wishlists.

## Important: what is not live yet
This is **Phase 1: the frontend starter**, not a finished bookstore. The displayed books are sample data. There is no real account login, checkout, payment processing, PDF reader, protected download, admin dashboard or author marketplace yet. Do not advertise it as accepting payments until those parts have been built and tested.

## Files
- `index.html` — page structure
- `styles.css` — design and responsive layout
- `app.js` — demo catalogue and interactions
- `supabase/schema.sql` — initial database tables and security policies

## Step 1 — Download and extract
1. Download `ilm_books_starter.zip`.
2. Extract it using your phone's Files app or a ZIP utility.
3. Keep the folder and its files together. Do not rename `index.html`, `styles.css` or `app.js`.

## Step 2 — Create the GitHub repository
1. Sign in to GitHub.
2. Create a new repository named `ilm-books` (Public is simplest for GitHub Pages).
3. Open the repository and choose **Add file → Upload files**.
4. Upload `index.html`, `styles.css`, `app.js`, and the `supabase` folder (including `schema.sql`).
5. Commit the files to the `main` branch.

If the mobile GitHub interface does not show folder upload, create `supabase` in the repository using **Add file → Create new file**, name it `supabase/schema.sql`, paste the SQL contents, and commit it.

## Step 3 — Publish the frontend with GitHub Pages
1. In the repository, open **Settings → Pages**.
2. Under Build and deployment, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Save and wait for deployment.
5. Your website address will look like `https://YOUR-USERNAME.github.io/ilm-books/`.

GitHub Pages hosts the public frontend only. It does not safely run payment secrets or server-side code.

## Step 4 — Connect Supabase
1. Open your Supabase project.
2. Go to **SQL Editor → New query**.
3. Open `supabase/schema.sql`, copy all its contents and paste into the SQL Editor.
4. Review the SQL, then run it.
5. In Supabase **Project Settings → API** (or API Keys), copy the Project URL and the publishable/anon key.
6. These public client values can later be placed in frontend configuration. Never copy the `service_role` / secret key into the website.

## Step 5 — Keep book PDFs private
1. In Supabase Storage, create a bucket named `book-files`.
2. Keep the bucket **private**.
3. Do not put paid PDF files in a public bucket.
4. Later, the backend must verify a completed payment and then issue a short-lived signed download URL. This requires server-side code, such as a Supabase Edge Function.

## Step 6 — Test the starter
- Open the published site on your phone.
- Search for "history".
- Try the category dropdown.
- Select Free and Paid.
- Check that the layout works on mobile and desktop.

## Development roadmap
1. **Phase 1 — Starter frontend:** included in this ZIP.
2. **Phase 2 — Supabase connection:** live book catalogue, customer sign-up/login and profiles.
3. **Phase 3 — Book details and reading:** book pages, previews, PDF reader and reading progress.
4. **Phase 4 — Admin dashboard:** secure admin-only book/author management.
5. **Phase 5 — Payments:** payment provider integration, server-side payment verification, receipts and secure paid downloads.
6. **Phase 6 — Customer library:** purchases, wishlist, bookmarks and history.
7. **Phase 7 — Author marketplace:** author applications, approval, sales reporting and commission handling.
8. **Phase 8 — Testing and launch:** mobile testing, security review, policies, backups and domain.

## Security and publishing rules
- Only upload books you own or have permission to distribute.
- Never expose Supabase service-role keys or payment-provider secret keys in frontend code.
- A successful browser redirect is not proof of payment. Verify payments on the server with the payment provider.
- Keep paid PDFs private and check purchase ownership before issuing access.
- Use HTTPS and test all access rules with separate customer and admin accounts.
- Add real Privacy Policy, Terms, Refund Policy and Contact details before accepting customers.

## Next action
Complete Steps 1–3 first. Then share your GitHub Pages website address and confirm that it opens. We can move to the Supabase connection together, one step at a time.
