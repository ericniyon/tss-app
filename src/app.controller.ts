import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): any {
        return this.appService.getHello();
    }

    @Get('test-email')
    @ApiOperation({ summary: 'Send a test email' })
    async testEmail(@Query('email') email?: string): Promise<any> {
        const testEmail = email || 'niyoeri6@gmail.com';
        return await this.appService.sendTestEmail(testEmail);
    }
}
