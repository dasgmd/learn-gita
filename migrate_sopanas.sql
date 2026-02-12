-- Migration script to add book_name and book_order to existing sopanas table

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sopanas' AND column_name='book_name') THEN
        ALTER TABLE public.sopanas ADD COLUMN book_name TEXT NOT NULL DEFAULT 'Uncategorized';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sopanas' AND column_name='book_order') THEN
        ALTER TABLE public.sopanas ADD COLUMN book_order INTEGER DEFAULT 0;
    END IF;
END $$;
