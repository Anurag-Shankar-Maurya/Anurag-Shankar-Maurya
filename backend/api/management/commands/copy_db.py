# command to run:
# python manage.py copy_db postgresql://postgres:Anurag3233..@db.whexcfolyzomegsatrah.supabase.co:5432/postgres postgresql://neondb_owner:npg_0z4UPMypDIfr@ep-odd-glade-ahekcd9u.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

import dj_database_url
from django.core.management.base import BaseCommand
from django.db import connections, transaction
from django.conf import settings

class Command(BaseCommand):
    help = 'Copies data from a source database to a destination database using database URLs.'

    def add_arguments(self, parser):
        parser.add_argument('source_db_url', type=str, help='The URL of the source database.')
        parser.add_argument('destination_db_url', type=str, help='The URL of the destination database.')

    def handle(self, *args, **options):
        source_db_url = options['source_db_url']
        destination_db_url = options['destination_db_url']

        # Configure database connections dynamically
        source_db_config = dj_database_url.parse(source_db_url)
        source_db_config.setdefault('OPTIONS', {})
        source_db_config.setdefault('TIME_ZONE', settings.TIME_ZONE)
        source_db_config.setdefault('AUTOCOMMIT', True)
        settings.DATABASES['source_temp'] = source_db_config

        destination_db_config = dj_database_url.parse(destination_db_url)
        destination_db_config.setdefault('OPTIONS', {})
        destination_db_config.setdefault('TIME_ZONE', settings.TIME_ZONE)
        destination_db_config.setdefault('AUTOCOMMIT', True)
        settings.DATABASES['destination_temp'] = destination_db_config

        source_db = 'source_temp'
        destination_db = 'destination_temp'

        self.stdout.write(self.style.SUCCESS(f"Starting database copy from source to destination"))

        try:
            # Determine the database vendor to adjust queries
            source_vendor = connections[source_db].vendor
            
            with connections[source_db].cursor() as source_cursor:
                if source_vendor == 'sqlite':
                    source_cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'django_%' AND name NOT LIKE 'auth_%';")
                elif source_vendor == 'postgresql':
                    source_cursor.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'django_%' AND tablename NOT LIKE 'auth_%';")
                else:
                    self.stdout.write(self.style.ERROR(f"Unsupported database vendor: {source_vendor}"))
                    return
                
                tables = [row[0] for row in source_cursor.fetchall()]

            # Sort tables by dependency (simple approach: assume tables with 'profile' in name come first)
            profile_tables = [t for t in tables if 'profile' in t.lower()]
            other_tables = [t for t in tables if 'profile' not in t.lower()]
            tables = profile_tables + other_tables

            for table_name in tables:
                self.stdout.write(f"Processing table: {table_name}")

                with connections[source_db].cursor() as source_cursor:
                    source_cursor.execute(f'SELECT * FROM "{table_name}"')
                    rows = source_cursor.fetchall()
                    columns = [col[0] for col in source_cursor.description]

                if not rows:
                    self.stdout.write(f"No data in table: {table_name}")
                    continue

                with transaction.atomic(using=destination_db):
                    with connections[destination_db].cursor() as dest_cursor:
                        dest_cursor.execute(f'DELETE FROM "{table_name}"')
                        self.stdout.write(self.style.SUCCESS(f"Cleared table '{table_name}' in destination database."))

                        placeholders = ", ".join(["%s"] * len(columns))
                        columns_formatted = ", ".join([f'"{c}"' for c in columns])
                        insert_query = f'INSERT INTO "{table_name}" ({columns_formatted}) VALUES ({placeholders})'
                        
                        dest_cursor.executemany(insert_query, rows)
                        self.stdout.write(self.style.SUCCESS(f"Copied {len(rows)} rows to table: '{table_name}'"))

            self.stdout.write(self.style.SUCCESS("\nDatabase copy completed successfully!"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))
        finally:
            # Clean up the temporary database configurations
            del settings.DATABASES['source_temp']
            del settings.DATABASES['destination_temp']
