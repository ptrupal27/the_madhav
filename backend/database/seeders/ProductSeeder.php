<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Create default categories if not exists
        $categories = [
            ['name' => ['en' => 'Agriculture', 'gu' => 'ખેતી', 'hi' => 'कृषि'], 'slug' => 'agriculture'],
            ['name' => ['en' => 'Gardening', 'gu' => 'બાગકામ', 'hi' => 'बागवानी'], 'slug' => 'gardening'],
            ['name' => ['en' => 'Seeds', 'gu' => 'બિયારણ', 'hi' => 'બીજ'], 'slug' => 'seeds'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], [
                'name' => $cat['name']
            ]);
        }

        $agricultureId = Category::where('slug', 'agriculture')->first()->id;
        $seedsId = Category::where('slug', 'seeds')->first()->id;

        $products = [
            ['id' => 1, 'name' => ['en' => 'Wheat Seeds', 'gu' => 'ઘઉંના બીજ', 'hi' => 'गेहूं के बीज'], 'category_id' => $seedsId, 'price' => 899, 'stock' => 100, 'image' => 'https://images.unsplash.com/photo-1622383529357-37b773f2fa16?w=500', 'description' => ['en' => 'High quality wheat seeds for better yield.', 'gu' => 'વધુ ઉત્પાદન માટે ઉચ્ચ ગુણવત્તાવાળા ઘઉંના બીજ.', 'hi' => 'बेहतर उपज के लिए उच्च गुणवत्ता वाले गेहूं के बीज।']],
            ['id' => 2, 'name' => ['en' => 'Soil Booster', 'gu' => 'જમીન બૂસ્ટર', 'hi' => 'मिट्टी बूस्टर'], 'category_id' => $agricultureId, 'price' => 1450, 'stock' => 100, 'image' => 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500', 'description' => ['en' => 'Organic soil booster for healthier plants.', 'gu' => 'તંદુરસ્ત છોડ માટે ઓર્ગેનિક જમીન બૂસ્ટર.', 'hi' => 'स्वस्थ पौधों के लिए जैविक मिट्टी बूस्टर।']],
            ['id' => 3, 'name' => ['en' => 'Tool Set', 'gu' => 'સાધન સેટ', 'hi' => 'टूल सेट'], 'category_id' => $agricultureId, 'price' => 1999, 'stock' => 100, 'image' => 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500', 'description' => ['en' => 'Complete gardening tool set for amateurs.', 'gu' => 'નવા નિશાળીયા માટે સંપૂર્ણ ગાર્ડનિંગ ટૂલ સેટ.', 'hi' => 'शौकिया लोगों के लिए पूर्ण बागवानी टूल सेट।']],
            ['id' => 4, 'name' => ['en' => 'Pesticide', 'gu' => 'જંતુનાશક', 'hi' => 'कीटनाशक'], 'category_id' => $agricultureId, 'price' => 450, 'stock' => 100, 'image' => 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?w=500', 'description' => ['en' => 'Effective pesticide for all crop types.', 'gu' => 'બધા પાક માટે અસરકારક જંતુનાશક.', 'hi' => 'सभी प्रकार की फसलों के लिए प्रभावी कीटनाशक।']],
            ['id' => 5, 'name' => ['en' => 'Aloe Vera', 'gu' => 'એલોવેરા', 'hi' => 'एलोवेरा'], 'category_id' => $agricultureId, 'price' => 299, 'stock' => 100, 'image' => 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500', 'description' => ['en' => 'Natural aloe vera plant for skin and health.', 'gu' => 'ત્વચા અને સ્વાસ્થ્ય માટે કુદરતી એલોવેરા છોડ.', 'hi' => 'त्वचा और स्वास्थ्य के लिए प्राकृतिक एलोवेरा का पौधा।']],
            ['id' => 6, 'name' => ['en' => 'Water Pump', 'gu' => 'વોટર પંપ', 'hi' => 'वाटर पंप'], 'category_id' => $agricultureId, 'price' => 8500, 'stock' => 50, 'image' => 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=500', 'description' => ['en' => 'Powerful water pump for irrigation.', 'gu' => 'ખેતી માટે પાવરફુલ વોટર પંપ.', 'hi' => 'सिंचाई के लिए शक्तिशाली वाटर पंप।']],
            ['id' => 7, 'name' => ['en' => 'Drip Pipe', 'gu' => 'ડ્રિપ પાઇપ', 'hi' => 'ड्रिप पाइप'], 'category_id' => $agricultureId, 'price' => 1200, 'stock' => 500, 'image' => 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500', 'description' => ['en' => 'Durable drip irrigation pipes.', 'gu' => 'ટકાઉ ડ્રિપ ઇરિગેશન પાઈપો.', 'hi' => 'टिकाऊ ड्रिप सिंचाई पाइप।']],
            ['id' => 8, 'name' => ['en' => 'Cow Feed', 'gu' => 'ગાયનો ખોરાક', 'hi' => 'गाय का चारा'], 'category_id' => $agricultureId, 'price' => 1800, 'stock' => 200, 'image' => 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500', 'description' => ['en' => 'Nutritious feed for dairy cows.', 'gu' => 'દૂધાળી ગાયો માટે પૌષ્ટિક આહાર.', 'hi' => 'दुधारू गायों के लिए पौष्टिक चारा।']],
            ['id' => 9, 'name' => ['en' => 'Wheat Seeds Premium', 'gu' => 'ઘઉંના બીજ પ્રીમિયમ', 'hi' => 'गेहूं के बीज प्रीमियम'], 'category_id' => $seedsId, 'price' => 499, 'stock' => 100, 'image' => 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=400', 'description' => ['en' => 'Premium selection for large scale farming.', 'gu' => 'મોટા પાયે ખેતી માટે પ્રીમિયમ પસંદગી.', 'hi' => 'बड़े पैमाने पर खेती के लिए प्रीमियम चयन।']],
            ['id' => 10, 'name' => ['en' => 'Manure', 'gu' => 'ખાતર', 'hi' => 'खाद'], 'category_id' => $agricultureId, 'price' => 850, 'stock' => 150, 'image' => 'https://images.unsplash.com/photo-1595053826286-2e59efd9ff18?q=80&w=400', 'description' => ['en' => 'Natural organic manure for soil fertility.', 'gu' => 'જમીનની ફળદ્રુપતા માટે કુદરતી ઓર્ગેનિક ખાતર.', 'hi' => 'मिट्टी की उर्वरता के लिए प्राकृतिक जैविक खाद।']],
            ['id' => 11, 'name' => ['en' => 'Trowel', 'gu' => 'પાવડો', 'hi' => 'फावड़ा'], 'category_id' => $agricultureId, 'price' => 220, 'stock' => 300, 'image' => 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400', 'description' => ['en' => 'Handheld trowel for precise gardening.', 'gu' => 'ચોક્કસ ગાર્ડનિંગ માટે હેન્ડહેલ્ડ પાવડો.', 'hi' => 'सटीक बागवानी के लिए हाथ से पकड़ा जाने वाला फावड़ा।']],
            ['id' => 12, 'name' => ['en' => 'Bio Pesticide', 'gu' => 'બાયો જંતુનાશક', 'hi' => 'बायो कीटनाशक'], 'category_id' => $agricultureId, 'price' => 560, 'stock' => 80, 'image' => 'https://images.unsplash.com/photo-1591461159338-795646f8885b?q=80&w=400', 'description' => ['en' => 'Chemical-free biological pesticide.', 'gu' => 'કેમિકલ રહિત બાયો જંતુનાશક.', 'hi' => 'रसायन मुक्त जैविक कीटनाशक।']],
            ['id' => 13, 'name' => ['en' => 'Drip Kit', 'gu' => 'ડ્રિપ કિટ', 'hi' => 'ड्रिप किट'], 'category_id' => $agricultureId, 'price' => 1200, 'stock' => 45, 'image' => 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=400', 'description' => ['en' => 'Complete home drip irrigation starter kit.', 'gu' => 'સંપૂર્ણ હોમ ડ્રિપ ઇરિગેશન સ્ટાર્ટર કિટ.', 'hi' => 'पूर्ण होम ड्रिप सिंचाई स्टार्टर किट।']],
            ['id' => 14, 'name' => ['en' => 'Sprayer', 'gu' => 'સ્પ્રેયર', 'hi' => 'स्प्रेयर'], 'category_id' => $agricultureId, 'price' => 990, 'stock' => 65, 'image' => 'https://images.unsplash.com/photo-1505305976870-c0be14102eaf?q=80&w=400', 'description' => ['en' => 'Manual sprayer for pesticides and fertilizers.', 'gu' => 'જંતુનાશકો અને ખાતરો માટે મેન્યુઅલ સ્પ્રેયર.', 'hi' => 'कीटनाशकों और उर्वरकों के लिए मैनुअल स्प्रेयर।']],
        ];

        foreach ($products as $prod) {
            Product::updateOrCreate(['id' => $prod['id']], [
                'category_id' => $prod['category_id'],
                'name' => $prod['name'],
                'slug' => Str::slug($prod['name']['en'] . '-' . $prod['id']),
                'price' => $prod['price'],
                'stock' => $prod['stock'],
                'image' => $prod['image'],
                'description' => $prod['description'],
                'is_active' => true
            ]);
        }
    }
}
