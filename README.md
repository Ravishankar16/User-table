## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (v16 or later recommended)
- npm or yarn

### Clone the repository

```bash
git clone https://github.com/Ravishankar16/User-table.git
cd <your-repo-folder>
npm install
npm run dev

# User Management Table (React + Vite + Ant Design)

A small demo project built with **React**, **Vite**, and **Ant Design** to showcase:

- Ant Design layout & theming (light / dark mode)
- Search, sorting, filtering
- Editable table rows with save / cancel
- Drag & drop for rows and columns
- Column visibility controls
---

## Features
- Sticky header with title and **light / dark mode** toggle.
- Global search input at the top-left.
- **Debounced** search (400ms) so it doesn’t fire on every keystroke.
- Searches across multiple fields (id, name, username, email, phone, age, birthDate, gender, city, company).
- “**Clear**” button (primary) to reset the search value.

### Table

The table is built with **Ant Design `<Table />`**

Table capabilities:

- **Sorting**
  - On `id`, `name`, `username`, `email`, `age`, `birthDate`.
- **Filtering**
  - By `gender` (Male / Female).
  - By `city`.
  - By `company`.
- **Editable rows**
  - Click **Edit** on a row to turn editable cells into `<Input />` fields.
  - Columns editable: `name`, `username`, `email`, `phone`, `age`, `birthDate`, `city`, `company`.
  - **Save** button validates and updates the row.
  - **Cancel** reverts to the original data.
- **Delete**
  - Delete button per row with Ant Design `Popconfirm` for confirmation.
- **Drag & Drop**
  - **Drag rows** to reorder (works across pagination pages; uses row keys, not indexes).
  - **Drag column headers** to reorder columns.
- **Column Display**
  - “**Column Display**” button opens a popover with a list of columns and checkboxes.
  - Checking/unchecking a column shows/hides it in the table.
  - “Reset” inside the popover restores default column order and visibility.
- **Global Reset**
  - Top-right **Reset** button clears:
    - Global search
    - Column visibility & order
    - Any current editing row
    - Table sort / filter state 
  - Pagination with page size selector and “X–Y of N users” summary.
  - Horizontal scroll for many columns, with fixed `ID` and `Actions` columns.
  - Sticky header when scrolling vertically.

---

## Project Structure

```text
src/
  App.jsx                 # layout, dark/light theme, card container
  main.jsx                # Vite/React entry point
  index.css               # minimal global styles
  components/
    SearchBar.jsx         # global search input
    UserTable.jsx         # all table logic

