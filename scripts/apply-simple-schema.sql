-- Script para aplicar el esquema simple completo

-- Crear tipos enum si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'paymentmethod') THEN
        CREATE TYPE PaymentMethod AS ENUM('CASH', 'MP');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'commissionstatus') THEN
        CREATE TYPE CommissionStatus AS ENUM('PENDING', 'PAID');
    END IF;
END $$;

-- Crear tabla users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'admin'
);

-- Crear tabla customers
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla staff
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    commission_rate_default DOUBLE PRECISION NOT NULL DEFAULT 0.4,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla sales
CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    customer_id TEXT,
    staff_id TEXT NOT NULL,
    payment_method PaymentMethod NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    services_text TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- Crear tabla cash_closings
CREATE TABLE IF NOT EXISTS cash_closings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    date DATE NOT NULL UNIQUE,
    cash_total DECIMAL(10,2) NOT NULL,
    mp_total DECIMAL(10,2) NOT NULL,
    expenses_total DECIMAL(10,2) NOT NULL,
    cash_final DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla commission_payments
CREATE TABLE IF NOT EXISTS commission_payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    staff_id TEXT NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    total_sales DECIMAL(10,2) NOT NULL,
    commission_rate DOUBLE PRECISION NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status CommissionStatus NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);