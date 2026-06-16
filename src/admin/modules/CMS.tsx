import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Pages', 'Blogs', 'Testimonials', 'Gallery', 'Banners', 'FAQs'] as const;
type Tab = typeof TABS[number];

export default function CMS() {
  const [tab, setTab] = useState<Tab>('Pages');

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 px-6 pt-6 border-b border-gray-100 bg-white flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Pages' && (
        <CRUDModule
          title="Pages"
          collectionName="pages"
          singularLabel="Page"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'title', label: 'Page Title', type: 'text', required: true },
            { key: 'slug', label: 'Slug / URL', type: 'text', required: true, placeholder: 'about-us' },
            { key: 'content', label: 'Content', type: 'textarea' },
            { key: 'metaTitle', label: 'Meta Title', type: 'text' },
            { key: 'metaDescription', label: 'Meta Description', type: 'textarea' },
            { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published', 'Archived'] },
          ]}
        />
      )}

      {tab === 'Blogs' && (
        <CRUDModule
          title="Blog Posts"
          collectionName="blogs"
          singularLabel="Blog Post"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'author', label: 'Author' },
            { key: 'category', label: 'Category' },
            { key: 'publishDate', label: 'Published' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'title', label: 'Blog Title', type: 'text', required: true },
            { key: 'author', label: 'Author', type: 'text', required: true },
            { key: 'category', label: 'Category', type: 'select', options: ['Health Tips', 'Maternity', 'Fertility', 'Paediatrics', 'Gynaecology', 'Urology', 'Nutrition', 'News & Events', 'Other'] },
            { key: 'summary', label: 'Summary', type: 'textarea' },
            { key: 'content', label: 'Content', type: 'textarea' },
            { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
            { key: 'imageUrl', label: 'Featured Image URL', type: 'text' },
            { key: 'publishDate', label: 'Publish Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published', 'Archived'] },
          ]}
        />
      )}

      {tab === 'Testimonials' && (
        <CRUDModule
          title="Testimonials"
          collectionName="testimonials"
          singularLabel="Testimonial"
          columns={[
            { key: 'patientName', label: 'Patient Name' },
            { key: 'department', label: 'Department' },
            { key: 'rating', label: 'Rating' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'patientName', label: 'Patient Name', type: 'text', required: true },
            { key: 'department', label: 'Department', type: 'text' },
            { key: 'testimonial', label: 'Testimonial', type: 'textarea', required: true },
            { key: 'rating', label: 'Rating (1-5)', type: 'number' },
            { key: 'imageUrl', label: 'Photo URL', type: 'text' },
            { key: 'date', label: 'Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published', 'Hidden'] },
          ]}
        />
      )}

      {tab === 'Gallery' && (
        <CRUDModule
          title="Gallery"
          collectionName="gallery"
          singularLabel="Gallery Item"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'imageUrl', label: 'Image URL' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'title', label: 'Title', type: 'text', required: true },
            { key: 'category', label: 'Category', type: 'select', options: ['Infrastructure', 'Events', 'Team', 'Procedures', 'NICU', 'OT', 'Other'] },
            { key: 'imageUrl', label: 'Image URL', type: 'text', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'sortOrder', label: 'Sort Order', type: 'number' },
            { key: 'status', label: 'Status', type: 'select', options: ['Published', 'Hidden'] },
          ]}
        />
      )}

      {tab === 'Banners' && (
        <CRUDModule
          title="Banners"
          collectionName="banners"
          singularLabel="Banner"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'page', label: 'Page' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'title', label: 'Banner Title', type: 'text', required: true },
            { key: 'page', label: 'Page', type: 'select', options: ['Home', 'About', 'Doctors', 'Departments', 'Services', 'Fertility Centre', 'Contact', 'All Pages'] },
            { key: 'type', label: 'Banner Type', type: 'select', options: ['Hero', 'Promotional', 'Announcement', 'Sidebar'] },
            { key: 'imageUrl', label: 'Image URL', type: 'text' },
            { key: 'linkUrl', label: 'Link URL', type: 'text' },
            { key: 'altText', label: 'Alt Text', type: 'text' },
            { key: 'sortOrder', label: 'Sort Order', type: 'number' },
            { key: 'startDate', label: 'Start Date', type: 'date' },
            { key: 'endDate', label: 'End Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
          ]}
        />
      )}

      {tab === 'FAQs' && (
        <CRUDModule
          title="FAQs"
          collectionName="faqs"
          singularLabel="FAQ"
          columns={[
            { key: 'question', label: 'Question' },
            { key: 'category', label: 'Category' },
            { key: 'sortOrder', label: 'Order' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'question', label: 'Question', type: 'text', required: true },
            { key: 'answer', label: 'Answer', type: 'textarea', required: true },
            { key: 'category', label: 'Category', type: 'select', options: ['General', 'Maternity', 'Fertility / IVF', 'Appointments', 'Billing', 'Pharmacy', 'Other'] },
            { key: 'sortOrder', label: 'Sort Order', type: 'number' },
            { key: 'status', label: 'Status', type: 'select', options: ['Published', 'Hidden'] },
          ]}
        />
      )}
    </div>
  );
}
