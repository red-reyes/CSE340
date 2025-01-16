-- 1
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')
-- 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' and account_lastname = 'Stark';
-- 3
DELETE from public.account
WHERE account_firstname='Tony' and account_lastname='Stark';
-- 4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE inv_make='GM' and inv_model='Hummer';
-- 5
SELECT
	public.inventory.inv_make, public.inventory.inv_model, public.classification.classification_name
FROM
	public.inventory
INNER JOIN
	public.classification ON public.inventory.classification_id=public.classification.classification_id
WHERE
	classification.classification_name='Sport';
-- 6
UPDATE
	public.inventory
SET
	inv_image = REPLACE(inv_image,'/images/','/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');